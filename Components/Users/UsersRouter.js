const express = require("express");
const usersController = require("./UsersController");
const addressesController = require("./AddressesController");
const authController = require("./Auth/AuthController");
const upload = require("../../helpers/upload.helper");

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

// User CRUD Routes
router
  .route("/")
  .get(authController.protect, usersController.getAllUsers)
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
router
  .route("/:id/address")
  .get(addressesController.getAllAddresses)
  .post(addressesController.addAddress);

router
  .route("/:id/address/:address")
  .get(addressesController.getAddress)
  .patch(addressesController.updateAddress)
  .delete(addressesController.deleteAddress);

module.exports = router;
