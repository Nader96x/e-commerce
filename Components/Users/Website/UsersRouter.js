const express = require("express");
const usersController = require("./UsersController");
const { protect } = require("../Auth/AuthController");
const upload = require("../../../helpers/upload.helper");
const addressController = require("./AddressesController");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.location;
  }
  next();
};

router
  .route("/")
  .all(protect)
  .get(usersController.getUser)
  .patch(upload.single("image"), assignImage, usersController.update)
  .delete(usersController.delete);

router
  .route("/address")
  .all(protect)
  .get(addressController.getAllAddresses)
  .post(addressController.addAddress);

router
  .route("/address/:id")
  .all(protect)
  .get(addressController.getAddress)
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

module.exports = router;
