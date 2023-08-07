require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3003;
const mongodbURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceMernDB";

module.exports = {
  serverPort,
  mongodbURL,
};
