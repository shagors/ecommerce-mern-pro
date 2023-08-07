const app = require("./app");
const { serverPort } = require("./secret");

// connection established for server
app.listen(serverPort, () => {
  console.log(`Server is running ${serverPort}`);
});
