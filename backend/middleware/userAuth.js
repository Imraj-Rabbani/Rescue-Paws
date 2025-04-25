import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;
    // console.log(token)
    if(!token){
        return res.json({success: false, message: "Not Authorized. Login Again middleware e asi", cookies: req.cookies})      
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.userId = tokenDecode.id
            console.log(req.userId, "User ID")
        }else{
            return res.json({success: false, message: "Not Authorized. Login again new line e ashchi"})
        }
        console.log("Before next() in userAuth");
        next()
    } catch (error) {
        return res.json({success: false, message: error.message})      
        
    }
}

export default userAuth;