const express = require("express");
const {
  getOrders,
  getOrder,
  confirmOrder,
  cancelOrder,
} = require("./OrdersController");
const { validateOrderId } = require("./OrderValidation");

const router = express.Router();

router.route("/").get(getOrders);
router.route("/:id").all(validateOrderId).get(getOrder);
router.patch("/:id/confirm", validateOrderId, confirmOrder);
router.patch("/:id/cancel", validateOrderId, cancelOrder);

module.exports = router;
