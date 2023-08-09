require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3003;
const mongodbURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/ecommerceMernDB";

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/model.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "123456anabia7890";

const smtpUserName = process.env.SMTP_USERNAME || "";
const smtpUserPassword = process.env.SMTP_PASSWORD || "";
const clientUrl = process.env.CLIENT_URL || "";

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  smtpUserName,
  smtpUserPassword,
  clientUrl,
};
