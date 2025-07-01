const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.registerUser
);

router.post(
  "/verify",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp").isNumeric().withMessage("OTP must be a number"),
  ],
  userController.verifyUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser
);

module.exports = router;
