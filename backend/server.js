import express from 'express';
import http from 'http';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

// create express app and http server
const app=express();
const server=http.createServer(app);

// Initialize socket.io server
export const io=new Server(server,{
  cors:{origin:"*"}
})

//store online users
export const userSocketMap={}; // {userId:socketId}

// socket.io connection handler 

io.on("connection",(socket)=>{
  const userId=socket.handshake.query.userId;
  console.log("User Connected",userId);
  if(userId) userSocketMap[userId]=socket.id;
  
  //emit online users to all connected clients
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  socket.io("disconnect",()=>{
    console.log("User Disconnected",userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
  })
  
})
// middleware setup

app.use(express.json({limit:"4mb"}));
app.use(cors());

//Routes setup
app.use('/api/status',(req,res)=>{
  res.send("Server is live");
});
app.use('/api/auth',userRouter);
app.use('/api/messages',messageRouter);

connectDB();
const Port=process.env.Port|| 3000;
server.listen(Port,(req,res)=>{
  console.log(`Server is running on PORT:${Port}`);
})




