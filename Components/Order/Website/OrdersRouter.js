const express = require("express");
const {
  getOrders,
  createOrder,
  cancelOrder,
  reorder,
} = require("./OrdersController");
const { validateAddressId, validateOrderId } = require("./OrderValidation");
const { protect } = require("../../Users/Website/Auth/AuthController");

const router = express.Router();

router
  .route("/")
  .all(protect)
  .get((req, res, next) => {
    req.body.id = req.user.id;
    next();
  }, getOrders)
  .post(validateAddressId, createOrder);

router.post(
  "/:id/reorder",
  protect,
  validateOrderId,
  validateAddressId,
  reorder
);

router.delete("/:id", protect, validateOrderId, cancelOrder);

module.exports = router;
