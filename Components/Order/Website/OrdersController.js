const AsyncHandler = require("express-async-handler");
const Order = require("../Order");
const User = require("../../Users/User");
const Product = require("../../Products/Product");
const ApiError = require("../../../Utils/ApiError");
const Factory = require("../../../Utils/Factory");

exports.getOrders = Factory.getAll(Order);

exports.createOrder = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { cart } = user;
  const orderAddress = await user.address.find((address) =>
    address._id.equals(req.body.address_id)
  );
  if (!orderAddress) return next(new ApiError("Address Not Found", 404));
  if (cart.length < 1) {
    return next(new ApiError("Cart is Empty", 400));
  }
  const products = cart.map((product) => {
    const { product_id, quantity, price } = product;
    return {
      product_id,
      quantity,
      price,
    };
  });
  const total_price = products.reduce((acc, product) => acc + product.price, 0);
  const order = new Order({
    user_id: req.user.id,
    products,
    total_price,
    address: orderAddress,
  });
  await order.save();
  user.cart = [];
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    data: order,
  });
});

exports.cancelOrder = AsyncHandler(async (req, res, next) => {
  const filter = { user_id: req.user.id };
  await Order.findOneAndUpdate(filter, { status: "Cancelled" });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.reorder = AsyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
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
  for (const product of order.products) {
    const { product_id, quantity, price } = product;
    const availableProduct = await Product.findOne({
      _id: product_id,
      quantity: { $gte: quantity },
    });
    if (!availableProduct) {
      return next(new ApiError(`Some Products Are Not Available`, 400));
    }
    products.push({
      product_id,
      quantity,
      price,
    });
  }
  const newOrder = new Order({
    user_id: req.user._id,
    products,
    total_price: order.total_price,
    address: orderAddress,
  });
  await newOrder.save();
  res.status(201).json({
    status: "success",
    data: newOrder,
  });
});
