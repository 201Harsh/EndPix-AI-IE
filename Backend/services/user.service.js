const UserModel = require("../models/user.model");
const TempUserModel = require("../models/tempUser.model");

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
