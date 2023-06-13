const express = require("express");
const { getOrders, createOrder, cancelOrder } = require("./OrdersController");
const { validateAddressId, validateOrderId } = require("./OrderValidation");
const { protect } = require("../../Users/Website/Auth/AuthController");

const router = express.Router();

router
  .route("/")
  .all(protect)
  .get(getOrders)
  .post(validateAddressId, createOrder);

router.delete("/:id", protect, validateOrderId, cancelOrder);

module.exports = router;
