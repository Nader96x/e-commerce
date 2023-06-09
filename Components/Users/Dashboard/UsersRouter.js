const express = require("express");
const usersController = require("./UsersController");
const addressesController = require("./AddressesController");
const upload = require("../../../helpers/upload.helper");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.location;
  }
  next();
};

// User CRUD Routes
router
  .route("/")
  .get(usersController.getAllUsers)
  .post(upload.single("image"), assignImage, usersController.createUser);
router
  .route("/:id")
  .get(usersController.getUser)
  .patch(upload.single("image"), assignImage, usersController.updateUser)
  .delete(usersController.deleteUser);

// User Status Routes
router.post("/:id/activate", usersController.activateUser);
router.post("/:id/deactivate", usersController.deActivateUser);

// Addresses Route
router.route("/:id/address").get(addressesController.getAllAddresses);
// .post(addressesController.addAddress);
//
// router
//   .route("/:id/address/:address")
//   .get(addressesController.getAddress)
//   .patch(addressesController.updateAddress)
//   .delete(addressesController.deleteAddress);

module.exports = router;
