const express = require("express");
const usersController = require("./UsersController");
const addressesController = require("./AddressesController");
const upload = require("../../helpers/upload.helper");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.location;
  }
  next();
};

const imageUpload = (req, res, next) => {
  if (req.file) upload.single("image");
  next();
};

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(imageUpload, assignImage, usersController.createUser);
router
  .route("/:id")
  .get(usersController.getUser)
  .delete(usersController.deleteUser);

router
  .route("/:id/address")
  .get(addressesController.getAllAddresses)
  .post(addressesController.addAddress);

module.exports = router;
