const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routers
const returnRouter = require('./routes/return');
const partnerRouter = require('./routes/partner');
const userrouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const marketplaceRouter = require('./routes/marketplace');


// DB and server startup
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connection success");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => {
    console.error("Error in DB connection:", err);
  });

// Routes
app.use('/return-api', returnRouter);
app.use('/partner-api', partnerRouter);
app.use('/admin-api', adminRouter);
app.use('/marketplace-api', marketplaceRouter);
app.use('/user-api', userrouter);
app.use((err,req,res,next)=>{
    console.log('error object in express errror handler: ',err);
    res.send({message:err.message})
})