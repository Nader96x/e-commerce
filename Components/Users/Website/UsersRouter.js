const express = require("express");
const usersController = require("./UsersController");
const authController = require("../Auth/AuthController");
const upload = require("../../../helpers/upload.helper");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.location;
  }
  next();
};

router.patch(
  "/",
  authController.protect,
  upload.single("image"),
  assignImage,
  usersController.updateMe
);

module.exports = router;
