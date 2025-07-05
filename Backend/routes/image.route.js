const router = require("express").Router();
const ImageController = require("../controllers/imageUpload.controller");
const uploadMiddleware = require("../middlewares/imageUpload.middleware");
const userMiddleware = require("../middlewares/user.middleware");

router.post(
  "/get-image",
  uploadMiddleware.single("image"),
  userMiddleware.authUser,
  ImageController.GetImage
);

module.exports = router;
