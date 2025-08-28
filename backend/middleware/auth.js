import User from "../models/User.model.js";
import jwt from "jsonwebtoken"
export const protectRoute=async(req,res,next)=>{
  try{
    const token=req.headers.token;
    const decoded=jwt.verify(token,process.env.JWT_SCERET);
    const user= await User.findById(decoded.userId).select("-password");
    if(!user) return res.json({sucess:false,message:"User not found"});
    req.user=user;
    next();
  }
  catch(e){
    console.log(e.message);
    return res.json({sucess:false,message:e.message});
  }
}