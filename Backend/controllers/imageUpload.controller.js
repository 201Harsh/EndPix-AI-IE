const userModel = require("../models/user.model");

module.exports.GetImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // req.file.buffer contains the image as binary
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    // Send base64 data URI to frontend
    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    const UserId = req.user.id;
    const User = await userModel.findById(UserId);

    if (!User) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    User.ImageUrl = imageUrl;
    await User.save();

    res.status(200).json({
      message: "Image processed successfully",
      image: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
