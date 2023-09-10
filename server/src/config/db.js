const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    logger.log("info", "Connect with mongoDB");
    mongoose.connection.on("error", (error) => {
      logger.log("error", "DB connection error!!");
    });
  } catch (error) {
    logger.log("error", "DB connection Failed", error.toString());
  }
};

module.exports = connectDB;
