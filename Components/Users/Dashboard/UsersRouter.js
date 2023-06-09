const express = require("express");
const usersController = require("./UsersController");
const addressesController = require("./AddressesController");
const upload = require("../../../helpers/upload.helper");
const {
  validateUserId,
  validateCreateUser,
  validateUpdateUser,
  validateGetAddress,
} = require("./UsersValidation");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file?.location) {
    req.body.image = req.file.location;
  } else{
    delete req.body.image
  }
  next();
};

// User CRUD Routes
router
  .route("/")
  .get(usersController.getAllUsers)
  .post(
    upload.single("image"),
    assignImage,
    validateCreateUser,
    usersController.createUser
  );
router
  .route("/:id")
  .all(validateUserId)
  .get(usersController.getUser)
  .patch(
    upload.single("image"),
    assignImage,
    validateUpdateUser,
    usersController.updateUser
  )
  .delete(usersController.deleteUser);

// User Status Routes
router.post("/:id/unban", validateUserId, usersController.activateUser);
router.post("/:id/ban", validateUserId, usersController.deActivateUser);

// Addresses Route
router.get("/:id/address", validateUserId, addressesController.getAllAddresses);

router.get(
  "/:id/address/:address",
  validateGetAddress,
  addressesController.getAddress
);

module.exports = router;
