const AsyncHandler = require("express-async-handler");
const { MyFatoorah } = require("myfatoorah-toolkit");
const Order = require("../Order");
const User = require("../../Users/User");
const Product = require("../../Products/Product");
const ApiError = require("../../../Utils/ApiError");
const pusher = require("../../../helpers/Pusher");
const Factory = require("../../../Utils/Factory");

const payment = new MyFatoorah("EGY", true);
// exports.getOrders = Factory.getAll(Order);
exports.getOrders = AsyncHandler(async (req, res, next) => {
exports.getOrders = Factory.getAll(Order);
/*exports.getOrders = AsyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user_id: req.user.id });
  res.status(200).json({
    status: "success",
    data: orders,
  });
});*/
exports.getOrder = Factory.getOne(Order);
/*
exports.getOrder = AsyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user_id: req.user.id,
  });
  if (!order) return next(new ApiError("Order Not Found", 404));
  res.status(200).json({
    status: "success",
    data: order,
  });
});
*/

exports.createOrder = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { cart } = user;
  const orderAddress = await user.address.find((address) =>
    address._id.equals(req.body.address_id)
  );
  if (!user.verified_at)
    return next(new ApiError("Please Verify your Email First", 400));
  if (!orderAddress) return next(new ApiError("Address Not Found", 404));
  if (cart.length < 1) {
    return next(new ApiError("Cart is Empty", 400));
  }
  const products = await Promise.all(
    cart.map(async (product) => {
      const { product_id, quantity, price, name_en, name_ar, image } = product;
      const prod = await Product.findById(product_id);
      if (!prod.is_active || !prod.category_id.is_active) return null;
      return {
        product_id,
        quantity,
        price,
        name_en,
        name_ar,
        image,
      };
    })
  );
  const unavailableProducts = products.filter((product) => product == null);
  if (unavailableProducts.length > 0)
    return next(
      new ApiError("Some Products Are no available at The Moment", 400)
    );
  const total_price = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const order = new Order({
    user_id: req.user.id,
    products,
    total_price,
    address: orderAddress,
  });
  if (req.body.payment_method) order.payment_method = req.body.payment_method;
  if (order.payment_method === "Credit Card") {
    payment
      .executePayment(order.total_price, 2, {
        CustomerName: user.name,
        DisplayCurrencyIso: "EGP",
        CustomerEmail: user.email,
      })
      .then((data) => {})
      .catch((err) => err);
  }
  await order.save();
  user.cart = [];
  await user.save({ validateBeforeSave: false });

  // Notify admins using Pusher
  const notificationMessage = "New order received";
  pusher.trigger("admin-channel", "new-order", {
    message: notificationMessage,
    order: order,
  });
  console.log(notificationMessage);
  if (req.body.payment_method) order.payment_method = req.body.payment_method;
  if (order.payment_method === "Credit Card") {
    payment
      .executePayment(order.total_price, 2, {
        CustomerName: user.name,
        DisplayCurrencyIso: "EGP",
        CurrencyIso: "EGP",
        CustomerEmail: user.email,
      })
      .then((data) => {
        res.status(201).json({
          status: "success",
          data: { order, data },
        });
      })
      .catch((err) => err);
  } else
    res.status(201).json({
      status: "success",
      data: order,
    });
});

exports.cancelOrder = AsyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user_id: req.user.id,
  }).populate("user", "name email");
  if (!order) return next(new ApiError("Order Not Found", 404));
  if (order.status !== "Pending")
    return next(new ApiError(`${order.status} Cannot be Cancelled`));
  order.status = "Cancelled";
  await order.save();
  res.status(200).json({
    status: "success",
    data: order,
  });
});

exports.reorder = AsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order || order.status !== "Completed") {
    return next(new ApiError("Order not found or Not Completed", 404));
  }
  let orderAddress = order.address;
  if (req.body.address_id) {
    const user = await User.findById(req.user.id);
    orderAddress = await user.address.find((address) =>
      address._id.equals(req.body.address_id)
    );
    if (!orderAddress) return next(new ApiError("Address Not Found", 404));
  }
  const products = [];
  let total_price = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const product of order.products) {
    const { product_id, quantity } = product;
    // eslint-disable-next-line no-await-in-loop
    const prod = await Product.findById(product_id);
    if (!prod.is_active || !prod.category_id.is_active)
      return next(new ApiError("Some Products are Not Available", 400));
    products.push({
      product_id,
      quantity,
      price: prod.price,
      name_en: prod.name_en,
      image: prod.image,
    });
    total_price += quantity * prod.price;
  }
  const newOrder = new Order({
    user_id: req.user._id,
    products,
    total_price: total_price,
    address: orderAddress,
  });
  await newOrder.save();
  res.status(201).json({
    status: "success",
    data: newOrder,
  });
});
