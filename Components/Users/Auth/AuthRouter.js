const express = require("express");
const authController = require("./AuthController");
const upload = require("../../../helpers/upload.helper");

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
  authController.signup
);

router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);

router.patch(
  "/update-password",
  authController.protect,
  authController.updatePassword
);

module.exports = router;
