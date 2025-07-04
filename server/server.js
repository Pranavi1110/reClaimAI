const exp=require('express');
const app=exp();
const mongoose = require('mongoose');
const cors=require("cors"); 
const dotenv=require("dotenv");

app.use(cors())
dotenv.config();

 const port=process.env.PORT||4000;

 mongoose.connect(process.env.MONGODB_URI)
    .then(()=>app.listen(port,()=>console.log(`server is listening to the port ${port}`)))
    .catch(err=>console.log("Error",err))
app.use(exp.json());

   
       
