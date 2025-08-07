import express from 'express';
import http from 'http';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './lib/db.js';


// create express app and http server
const app=express();
const server=http.createServer(app);

// middleware setup

app.use(express.json({limit:"4mb"}));
app.use(cors());

app.use('/api/status',(req,res)=>{
  res.send("Server is live");
});
connectDB();
const Port=process.env.Port|| 3000;
server.listen(Port,(req,res)=>{
  console.log(`Server is running on PORT:${Port}`);
})




