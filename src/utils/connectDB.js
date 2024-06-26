const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(config.MONGODB_URI);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
