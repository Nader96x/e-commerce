const express = require("express");
const {
  getOrders,
  createOrder,
  cancelOrder,
  reorder,
  getOrder,
  successOrder,
  failOrder,
} = require("./OrdersController");
const { validateCheckout, validateOrderId } = require("./OrderValidation");
const { protect } = require("../../Users/Website/Auth/AuthController");

const router = express.Router();

const User_Orders = (req, res, next) => {
  req.query.user_id = req.user.id;
  req.opts = { user_id: req.user.id };
  next();
  // console.log("getOrders", req.body);
};

router
  .route("/")
  .all(protect)
  .get(User_Orders, getOrders)
  .post(validateCheckout, createOrder);

router.post(
  "/:id/reorder",
  protect,
  validateOrderId,
  validateCheckout,
  reorder
);

router.delete("/:id", protect, validateOrderId, cancelOrder);
router.get("/:id", protect, validateOrderId, User_Orders, getOrder);
router.get("/payment/success", successOrder);
router.get("/payment/fail", failOrder);

module.exports = router;
