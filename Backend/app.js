const express = require("express");
const connectTODB = require("./config/db");
connectTODB();
const UserRouter = require("./routes/user.route");
const ImageRouter = require("./routes/image.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use("/users", UserRouter);
app.use("/image", ImageRouter);

module.exports = app;
