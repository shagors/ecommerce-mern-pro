require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3003;

module.exports = {
  serverPort,
};
