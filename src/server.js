const dotenv = require("dotenv");
dotenv.config({ path: "./src/.env", debug: true });

const http = require("http");

const { connectDB } = require("./services/mysql");
const app = require("./app");

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () =>
      console.log(`server listening at port ${PORT}...`)
    );
  } catch (err) {
    console.log(err);
  }
};

startServer();
