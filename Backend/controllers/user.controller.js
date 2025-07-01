const userModel = require("../models/user.model");
const TempuserModel = require("../models/tempuser.model");
const { validationResult } = require("express-validator");
const UserService = require("../services/user.service");

module.exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    const isUserExist = await TempuserModel.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP

    const newUser = await UserService.CreateTempUser({
      name,
      email,
      password: hashedPassword,
      otp,
    });

    res.status(200).json({
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
