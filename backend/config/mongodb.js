const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected successfully");
  } catch (error) {
    console.log("Failed to connect with DataBase",error);
  }
};

module.exports =  connectDB; 
