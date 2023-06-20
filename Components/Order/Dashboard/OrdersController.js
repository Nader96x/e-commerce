const AsyncHandler = require("express-async-handler");
const axios = require("axios");
const Factory = require("../../../Utils/Factory");
const ApiError = require("../../../Utils/ApiError");
const Order = require("../Order");
const pusher = require("../../../helpers/Pusher");
/*
 * @description get all orders in the system for admin / get all orders for specific user by userID
 * @route GET /api/v1/orders
 * @access private[ user -admin]
 */
module.exports.getOrders = Factory.getAll(Order);
/*
 * @description get specific order by orderID
 * @route GET /api/v1/orders/:id
 * @access private[ user - admin ]
 */
module.exports.getOrder = Factory.getOne(Order);

module.exports.confirmOrder = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("user", "name email");

  if (!order) {
    return next(new ApiError("Order Not Found", 404));
  }
  if (order.status !== "Pending") {
    return next(new ApiError(`${order.status} Order Cannot Be Processed`, 404));
  }
  if (order.payment_method === "Credit Card")
    return next(
      new ApiError(
        `You Cannot confirm order that will be paid with Credit`,
        404
      )
    );

  const updatedAddress = {
    Area: order.address.area,
    City: order.address.city,
    Governate: order.address.governorate,
    Country: order.address.country,
  };

  const dispatchingProducts = order.products.map((product) => ({
    product_id: product.product_id,
    quantity: product.quantity,
    price: product.price,
    name_en: product.name_en,
  }));

  axios
    .post(process.env.DISPATCHING_URL, {
      _id: order.id,
      CustomerID: order.user._id,
      CustomerName: order.user.name,
      CustomerEmail: order.user.email,
      Address: updatedAddress,
      Product: dispatchingProducts,
      PaymentMethod: order.payment_method,
      TotalPrice: order.total_price,
    })
    .then((response) => {
      order.status = "Processing";
      pusher.trigger(`user-${order.user_id}`, "my-order", {
        message: "Your order is being processed",
        order_id: order._id,
        status: order.status,
      });
      order.save();
      res.status(200).json({
        status: "success",
        data: {
          order_id: order._id,
          status: order.status,
          payment_status: order.payment_status,
          payment_method: order.payment_method,
        },
      });
    })
    .catch((err) => {
      if (process.env.NODE_ENV === "development") {
        order.status = "Processing";
        pusher.trigger(`user-${order.user_id}`, "my-order", {
          message: "Your order is being processed",
          order_id: order._id,
          status: order.status,
        });
        order.save();
        res.status(200).json({
          status: "success",
          data: {
            order_id: order._id,
            status: order.status,
            payment_status: order.payment_status,
            payment_method: order.payment_method,
          },
        });
      }
      err.message = `An Error Occurred While Dispatch this Order${err.message}`;
      next(new ApiError(err.message, Number(err.message.split("code ")[1])));
    });
});

module.exports.cancelOrder = AsyncHandler(async (req, res, next) => {
  const filter = { _id: req.params.id };
  const order = await Order.findById(filter).populate("user", "name email");
  if (!order) return next(new ApiError("Order Not Found", 404));
  if (order.status !== "Pending") {
    return next(new ApiError(`${order.status} Order Cannot Be Cancelled`, 404));
  }
  order.status = "Cancelled";
  order.payment_status = "Cancelled";
  pusher.trigger(`user-${order.user_id}`, "my-order", {
    message: "Your order has been cancelled",
    order_id: order._id,
    status: order.status,
  });
  await order.save();
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
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
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
