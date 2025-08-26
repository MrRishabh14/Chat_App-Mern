import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../server.js";

export const getUserForSidebar=async(req,res)=>{
  try{
    const userId=req.user._id;
    const filterUsers= await User.find({_id:{$ne:userId}}).select("-password");

    //count number of messages not seen
    const unseenMessage={};
    const promises=filterUsers.map(async(user)=>{
      const messages=await Message.find({senderId:user._id,recevierId:userId,seen:false});
      if(messages.length>0){
        unseenMessage[user._id]=messages.length;
      }
    });
    await Promise.all(promises);
    res.json({sucess:true,users:filterUsers,unseenMessage});
  }
  catch(e){
    console.log(e.message);
    res.json({sucess:false,message:e.message});  
  }
}

export const getMessage=async(req,res)=>{
  try {
    const {id:selectedUserId}=req.params;
    const myId=req.user._id;

    const messages=await Message.find({
      $or:[
        {senderId:myId,recieverId:selectedUserId},
        {senderId:selectedUserId,recieverId:myId}
      ]
    })
    await Message.updateMany({senderId:selectedUserId,recieverId:myId},{seen:true});
    
    res.json({sucess:true},messages)
  } catch (e) {
    console.log(e.message);
    res.json({sucess:false,message:e.message});  
  }
}

// api to mark message as seen using message id

export const markMessageAsSeen=async(req,res)=>{
  try {
    const {id}=req.params;
    await Message.findByIdAndUpdate(id,{seen:true})
    res.json({sucess:true})
    
  } catch (e) {
    console.log(e.message);
    res.json({sucess:false,message:e.message});
  }
}


export const sendMessage=async(req,res)=>{
  try{
    const{text,image}=req.body;
    const recieverId=req.params.id;
    const senderId=req.user._id;

    let imageUrl;
    if(image){
      const uploadResponse=await cloudinary.uploader.upload(image);
      imageUrl=uploadResponse.secure_url;
    }
    const newMessage=await Message.create({
      senderId,
      recieverId,
      text,
      image:imageUrl,
    });

    //Emit the new messages to the reciever's socket
    const recevierSocketId=userSocketMap[recieverId];
    if(recevierSocketId){
      io.to(recevierSocketId).emit("newMessage",newMessage);
    }
    res.json({sucess:true,newMessage});
  }
  catch(e){
    console.log(e.message);
    res.json({sucess:false,message:e.message});
  }
}