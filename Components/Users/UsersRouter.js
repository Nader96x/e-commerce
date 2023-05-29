const express = require("express");
const usersController = require("./UsersController");
const addressesController = require("./AddressesController");
const upload = require("../../helpers/upload.helper");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file) {
    if (req.file.image) {
      req.body.image = req.file.location;
    }
  }
  next();
};

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(upload.single("image"), assignImage, usersController.createUser);
router
  .route("/:id")
  .get(usersController.getUser)
  .delete(usersController.deleteUser);

router
  .route("/:id/address")
  .get(addressesController.getAllAddresses)
  .post(addressesController.addAddress);

module.exports = router;
