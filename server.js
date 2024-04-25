const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const port = 8080;
process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT EXCEPTION! shutting down ....");
  //process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`${port} port is listening`);
});
