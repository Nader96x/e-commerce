const express = require("express");
const { getOrders,getOrder,createOrder,updateOrder,deleteOrder } = require("./OrdersController")
const router = express.Router();

router.route("/")
  .get(getOrders)
  .post(createOrder)
router.route("/:id")
  .get(getOrder)
  .patch(updateOrder)
  .delete(deleteOrder)

module.exports = router;