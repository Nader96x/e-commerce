const AsyncHandler = require("express-async-handler");
const OrderModel = require("../Order");
const Factory = require("../../../Utils/Factory");
const ApiError = require("../../../Utils/ApiError");
/*
 * @description get all orders in the system for admin / get all orders for specific user by userID
 * @route GET /api/v1/orders
 * @access private[ user -admin]
 */
module.exports.getOrders = Factory.getAll(OrderModel);
/*
 * @description get specific order by orderID
 * @route GET /api/v1/orders/:id
 * @access private[ user - admin ]
 */
module.exports.getOrder = Factory.getOne(OrderModel);

module.exports.confirmOrder = AsyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order || order.status === "Complete" || order.status === "Cancelled") {
    return next(new ApiError("Order Cannot Be Updated", 400));
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: order,
  });
});

module.exports.cancelOrder = AsyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(req.params.id, {
    status: "Cancelled",
  });
  if (!order) {
    return next(new ApiError("Order Not Found", 404));
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: order,
  });
});
