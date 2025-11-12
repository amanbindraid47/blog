import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/Blog").then(()=>{
    console.log("connected!");
}).catch((err)=>{
    console.log(err);
})