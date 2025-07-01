const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");
const UserMiddleware = require("../middlewares/user.middleware");

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

router.post('/logout', UserMiddleware.authUser, userController.logoutUser);

router.get('/get-user', UserMiddleware.authUser ,userController.getUser);

module.exports = router;
