const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./controllers/loggerController");
const { serverPort } = require("./secret");

// connection established for server
app.listen(serverPort, async () => {
  logger.log("info", `Server is running ${serverPort}`);
  await connectDB();
});
