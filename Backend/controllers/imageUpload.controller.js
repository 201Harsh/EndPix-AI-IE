const userModel = require("../models/user.model");
const ImageEnhanceAI = require("../services/ImageAI.service");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.GetImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.ImageUrl = result.secure_url;
    await user.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      image: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.EnhanceImage = async (req, res) => {
  try {
    const { prompt, style, upscaling } = req.body;

    const UserId = req.user.id;
    const User = await userModel.findById(UserId);

    if (!User) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const UserImage = User.ImageUrl;

    if (!UserImage) {
      return res.status(400).json({
        message: "User has no image",
      });
    }

    const EnhanceImage = await ImageEnhanceAI(
      UserImage,
      prompt,
      style,
      upscaling
    );

    res.status(200).json({
      message: "Image enhanced successfully",
      image: EnhanceImage,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
