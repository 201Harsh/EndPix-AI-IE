const userModel = require("../models/user.model");
const TempuserModel = require("../models/tempuser.model");
const { validationResult } = require("express-validator");
const UserService = require("../services/user.service");
const transporter = require("../services/MailerSender");

module.exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    const isTempUserExist = await TempuserModel.findOne({ email });
    if (isTempUserExist) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const isUserExist = await userModel.findOne({ email });
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

    const info = await transporter.sendMail({
      from: `"EndPix AI" <${process.env.MAILER_USER}>`, // Sender address
      to: email, // List of recipients
      subject: "OTP Verification", // Subject line
      text: `Your OTP is ${otp}`, // Plain text body
    });

    res.status(201).json({
      message: "Verify email to complete registration",
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.verifyUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, otp } = req.body;

    const NewUser = await UserService.VerifyUser(email, otp);

    const token = await NewUser.JWT_Token();

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "User verified and Registered successfully",
      NewUser,
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const User = await userModel.findOne({ email });
    if (!User) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isPasswordMatch = await User.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = await User.JWT_Token();

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "User logged in successfully",
      User,
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id; // user ID is stored in req.user by the auth middleware
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.logoutUser = async (req, res) => {
  try {
    const userId = req.user.id; // user ID is stored in req.user by the auth middleware
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.clearCookie("token");
    res.status(200).json({
      message: "User logged out successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
