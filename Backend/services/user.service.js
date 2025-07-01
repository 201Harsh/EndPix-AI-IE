const UserModel = require("../models/user.model");
const TempUserModel = require("../models/tempuser.model");

module.exports.CreateTempUser = async ({ name, email, password, otp }) => {
  if (!name || !email || !password || !otp) {
    throw new Error("All fields are required");
  }

  const TempUser = TempUserModel.create({
    name,
    email,
    password,
    otp,
    otpExpiry: Date.now() + 5 * 60 * 1000,
  });
  return TempUser;
};

module.exports.VerifyUser = async (email, otp) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await TempUserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.otpExpiry < Date.now()) {
    throw new Error("OTP has expired");
  }

  const newUser = await UserModel.create({
    name: user.name,
    email: user.email,
    password: user.password,
  });

  await TempUserModel.deleteOne({ email });
  return newUser;
};
