const express = require("express");
const controller = require("../Components/Order/Dashboard/OrdersController");

const router = express.Router();

router.post("/orders/:id/complete", controller.completeOrder);
router.post("/orders/:id/cancel", controller.cancelOrder);

module.exports = router;
