const express = require("express");
const usersController = require("./UsersController");
const { protect } = require("./Auth/AuthController");
const upload = require("../../../helpers/upload.helper");
const addressController = require("./AddressesController");
const { validateUpdateProfile } = require("./UsersValidation");
const {
  validateAddressId,
  validateAddAddress,
  validateUpdateAddress,
} = require("./AddressesValidation");

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
  .patch(
    upload.single("image"),
    assignImage,
    validateUpdateProfile,
    usersController.update
  )
  .delete(usersController.delete);

router
  .route("/address")
  .all(protect)
  .get(addressController.getAllAddresses)
  .post(validateAddAddress, addressController.addAddress);

router
  .route("/address/:id")
  .all(protect)
  .get(validateAddressId, addressController.getAddress)
  .patch(validateUpdateAddress, addressController.updateAddress)
  .delete(validateAddressId, addressController.deleteAddress);

module.exports = router;
