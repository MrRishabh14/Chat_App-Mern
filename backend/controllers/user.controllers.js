import cloudinary from "../lib/cloudinary";
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

// controler to check if user is authenticted or not

export const checkAuth=(res,req)=>{
  res.json({sucess:true,user:req.user});
}

//controler to update user profile details

export const updateProfile=async(res,req)=>{
  try{
    const {profilePic,bio,fullName}=req.body;
    const userId=req.user_id;
    let updatedUser;
    if(!profilePic){
      updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
    }else{
      const upload=await cloudinary.uploader.upload(profilePic);
      updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});
    }

    res.json({sucess:true,user:updatedUser});
  }
  catch(e){
    console.log(e.message);
    res.json({sucess:false,message:e.message});
  }
}