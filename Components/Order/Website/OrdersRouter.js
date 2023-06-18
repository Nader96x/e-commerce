const express = require("express");
const {
  getOrders,
  createOrder,
  cancelOrder,
  reorder,
  getOrder,
} = require("./OrdersController");
const { validateCheckout, validateOrderId } = require("./OrderValidation");
const { protect } = require("../../Users/Website/Auth/AuthController");

const router = express.Router();

router
  .route("/")
  .all(protect)
  .get((req, res, next) => {
    req.body.id = req.user.id;
    next();
  }, getOrders)
  .post(validateCheckout, createOrder);

router.post(
  "/:id/reorder",
  protect,
  validateOrderId,
  validateCheckout,
  reorder
);

router.delete("/:id", protect, validateOrderId, cancelOrder);
router.get("/:id", protect, validateOrderId, getOrder);

module.exports = router;
