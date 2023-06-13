const AsyncHandler = require("express-async-handler");
const OrderModel = require("../Order");
const Factory = require("../../../Utils/Factory");
const ApiError = require("../../../Utils/ApiError");
const Order = require("../Order");
const pusher = require("../../../helpers/Pusher");

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
  const filter = { _id: req.params.id };
  const order = await Order.findOneAndUpdate(
    filter,
    { status: "Processing" },
    { new: true }
  );

  pusher.trigger(`user-${order.user_id}`, "my-order", {
    message: "Your order is being processed",
    order_id: order._id,
    status: order.status,
  });

  res.status(200).json({
    status: "success",
    data: {
      order_id: order._id,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
    },
  });
});

module.exports.cancelOrder = AsyncHandler(async (req, res, next) => {
  const filter = { _id: req.params.id };
  const order = await Order.findOneAndUpdate(
    filter,
    { status: "Cancelled" },
    { new: true }
  );

  pusher.trigger(`user-${order.user_id}`, "my-order", {
    message: "Your order has been cancelled",
    order_id: order._id,
    status: order.status,
  });

  res.status(200).json({
    status: "success",
    data: {
      order_id: order._id,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
    },
  });
});

module.exports.completeOrder = AsyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order is not found.", 404));
  }
  if (order.status !== "Processing") {
    return next(new ApiError(`${order.status} Order cannot be completed`, 400));
  }
  order.status = "Completed";
  order.payment_status = "Paid";
  await order.save({ validateBeforeSave: false });

  pusher.trigger(`user-${order.user_id}`, "my-order", {
    message: "Your order has been completed",
    order_id: order._id,
    status: order.status,
  });

  res.status(200).json({
    status: "success",
    data: {
      order_id: order._id,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
    },
  });
});
