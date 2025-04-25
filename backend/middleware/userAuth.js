import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.json({success: false, message: "Not Authorized. Login Again middleware e asi", cookies: req.cookies})      
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.userId = tokenDecode.id
        }else{
            return res.json({success: false, message: "Not Authorized. Login again new line e ashchi"})
        }
        next()
    } catch (error) {
        return res.json({success: false, message: error.message})      
        
    }
}

export default userAuth;