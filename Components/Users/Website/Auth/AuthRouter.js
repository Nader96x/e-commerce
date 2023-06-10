const express = require("express");
const authController = require("./AuthController");
const upload = require("../../../../helpers/upload.helper");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword,
} = require("../UsersValidation");

const router = express.Router();
const assignImage = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.location;
  }
  next();
};

router.post(
  "/register",
  upload.single("image"),
  assignImage,
  validateRegister,
  authController.signup
);

router.post("/login", validateLogin, authController.login);
router.post(
  "/forgot-password",
  validateForgotPassword,
  authController.forgotPassword
);
router.patch(
  "/reset-password/:token",
  validateResetPassword,
  authController.resetPassword
);

router.patch(
  "/update-password",
  authController.protect,
  validateUpdatePassword,
  authController.updatePassword
);

module.exports = router;
