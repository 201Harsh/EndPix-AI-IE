const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
});

tempUserSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 300 });


const TempUser = mongoose.models.TempUser || mongoose.model("TempUser", tempUserSchema);

module.exports = TempUser;
