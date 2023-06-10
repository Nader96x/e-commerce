const express = require("express");
const usersController = require("./UsersController");
const { protect } = require("./Auth/AuthController");
const upload = require("../../../helpers/upload.helper");
const addressController = require("./AddressesController");
const cartController = require("./CartController");
const { validateUpdateProfile } = require("./UsersValidation");
const {
  validateAddressId,
  validateAddAddress,
  validateUpdateAddress,
} = require("./AddressesValidation");
const { validateAddProductToCart } = require("./CartValidation");

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

// Address Routes

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

// Cart Routes
router
  .route("/cart")
  .all(protect)
  .get(cartController.getCartProducts)
  .delete(cartController.emptyCart);

router.patch(
  "/cart/add",
  protect,
  validateAddProductToCart,
  cartController.addProduct
);
router.patch("/cart/remove", protect, cartController.removeProduct);

module.exports = router;
