require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3003;
const mongodbURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceMernDB";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/model.png";

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
};
