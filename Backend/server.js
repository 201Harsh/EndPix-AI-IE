const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
