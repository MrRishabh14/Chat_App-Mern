import { generateToken } from "../lib/utils";
import User from "../models/User.model";
import bycrpt from 'bcryptjs'

export const signup=async(req,res)=>{
  const {fullName,email,password,bio}=req.body;

  try{
    if(!fullName || !email || !password || !bio){
      return res.json({sucess:false,message:"missing creds"});
    }
    const user=await User.findOne({email});
    if(user){
      return res.json({sucess:false,message:"User already exists"});
    }

    const salt=await bycrpt.genSalt(10);
    const hashPassword=await bycrpt.hash(password,salt);

    const newUser= User.create({
      fullName,
      email,
      password:hashPassword,
      bio
    });

    const token=generateToken(newUser._id);
    res.json({sucess:true,userData:newUser,token,message:"User Created"})

  }
  catch(e){
    console.log(e.message);
    res.json({sucess:false,message:e.message});
  }
}


export const login=async(res,req)=>{
  try{
    const{email,password}=req.body;

    if(!email || !password){
      return res.json({sucess:false,message:"missing creds"});
    }

    const userData=await User.findOne({email});
    if(!userData){
       return res.json({sucess:false,message:"Account does not exist"});
    }
    const isPassword=await bycrpt.compare(password,userData.password);
    if(!isPassword){
      return res.json({sucess:false,message:"Wrong passowrd"});
    }
    const token=generateToken(userData._id);
     res.json({sucess:true,userData,token,message:"User Logged in"})
  }
  catch(e){
    console.log(e.message);
    res.json({sucess:false,message:e.message});
  }
}