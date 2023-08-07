const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.log("Connect with mongoDB");
    mongoose.connection.on("error", (error) => {
      console.error("DB connection error!!");
    });
  } catch (error) {
    console.error("DB connection Failed", error.toString());
  }
};

module.exports = connectDB;
