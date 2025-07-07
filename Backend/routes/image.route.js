const router = require("express").Router();
const ImageController = require("../controllers/imageUpload.controller");
const uploadMiddleware = require("../middlewares/imageUpload.middleware");
const userMiddleware = require("../middlewares/user.middleware");

router.post(
  "/upload",
  uploadMiddleware.single("image"),
  userMiddleware.authUser,
  ImageController.GetImage
);

router.post('/ImageEnhancer', userMiddleware.authUser ,ImageController.EnhanceImage);

module.exports = router;
