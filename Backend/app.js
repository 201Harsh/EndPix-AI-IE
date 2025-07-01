const express = require("express");
const connectTODB = require("./config/db");
connectTODB();
const UserRouter = require("./routes/user.route");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", UserRouter);

module.exports = app;
