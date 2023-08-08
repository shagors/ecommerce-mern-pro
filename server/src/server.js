const app = require("./app");
const connectDB = require("./config/db");
const { serverPort } = require("./secret");

// connection established for server
app.listen(serverPort, async () => {
  console.log(`Server is running ${serverPort}`);
  await connectDB();
});
