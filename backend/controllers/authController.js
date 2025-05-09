import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';


export const register = async (req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password){
        return res.json({success: false, message: "Missing Details"})
    }

    try {

        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success: false, message: "User Already Exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({ id: user._id},process.env.JWT_SECRET,{ expiresIn: "7d" });
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //Sending Welcome Email
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject: "Welcome to Stray Paws",
            text: "Welcome to Stray Paws. Your Account has been created."
        }

        await transporter.sendMail(mailOptions)

        return res.json({success:true})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


export const login = async (req, res) => {

    const {email, password} = req.body

    if(!email || !password){
        return res.json({success:false, message: 'Email and Password are required'})
    }

    try {
        const user = await userModel.findOne({email}) 
        if(!user){
            return res.json({success:false, message: "Invalid Email"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false, message: "Invalid Password"})
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          
          

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({
            success: true,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
          

    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success:true, message: 'Logged out'})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}


//send verification OTP to the user's email
export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req;
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if(!user.isAccountVerified){
            return res.json({success:false, message: "Account Already Verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        }

        await transporter.sendMail(mailOptions)

        res.json({success: true, message: "Verfication OTP sent on Email" })

    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

export const verifyEmail = async (req, res) => {
    const {userId} = req;
    const {otp} = req.body;

    if(!userId || !otp){
        return res.json({success:false, message: "Missing Details"})
    }

    try {
        const user = await userModel.findById(userId)
        if(!user){
            return res.json({success:false, message: "User Not Found"})
        }
        if(user.verifyOtp === ''|| user.verifyOtp !== otp){
            return res.json({success:false, message: "Invalid OTP"})
        }
        if(user.verifyOtpExpireAt<Date.now()){
            return res.json({success:false, message: "OTP Expired"})
        }

        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0

        await user.save()
        return res.json({success:true, message: "Email Verified Successfully"})



    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}

//Check is user is authenticated
export const isAuthenticated = async(req, res) => {
    try {
        return res.json({success:true})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}


// In your authController.js
export const authStatus = async (req, res) => {
    const {userId} = req
    try {
        if (!userId) {
            return res.json({ success: false });
        }

        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.json({ success: false });
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
