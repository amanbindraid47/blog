const mongoose = require("mongoose");
require('dotenv').config();


mongoose.set('strictQuery', false);


mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Blog").then(()=>{
    console.log("Database connected!");
}).catch((err)=>{
    console.log("Database not connected", err);

})