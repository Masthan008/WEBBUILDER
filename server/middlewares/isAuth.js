import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
const isAuth=async (req,res,next)=>{
try {
    // Try to get token from cookie first, then from Authorization header
    let token = req.cookies.token
    
    if (!token) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7)
        }
    }
    
    if(!token){
        return res.status(400).json({message:"token not found"})
    }
     const decoded=jwt.verify(token,process.env.JWT_SECRET)
     req.user=await User.findById(decoded.id)
     next()
} catch (error) {
    return res.status(500).json({message:"invalid token"})
}
}

export default isAuth
