const express = require("express");
const {
  forgotPassword,
  logout,
  protect,
  updatePassword,
  resetPassword,
  login,
  signup,
  verifyEmail,
  sendNewVerificationCode,
} = require("./AuthController");
const upload = require("../../../../helpers/upload.helper");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword,
  validateToken,
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
  signup
);

router.post("/login", validateLogin, login);

router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.patch(
  "/reset-password/:token",
  validateToken,
  validateResetPassword,
  resetPassword
);
router.get("/verify-email/:token", protect, validateToken, verifyEmail);
router.post("/resend-verification-code", protect, sendNewVerificationCode);

router.patch(
  "/update-password",
  protect,
  validateUpdatePassword,
  updatePassword
);

router.delete("/logout", protect, logout);

module.exports = router;
