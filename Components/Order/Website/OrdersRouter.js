const express = require("express");
const { getOrders, createOrder } = require("./OrdersController");
const { protect } = require("../../Users/Website/Auth/AuthController");

const router = express.Router();

router.route("/").all(protect).get(getOrders).post(createOrder);

module.exports = router;
