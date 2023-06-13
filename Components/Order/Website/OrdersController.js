const AsyncHandler = require("express-async-handler");
const Order = require("../Order");
const User = require("../../Users/User");
const Factory = require("../../../Utils/Factory");
const ApiError = require("../../../Utils/ApiError");

exports.getOrders = AsyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user_id: req.user.id });
  res.status(200).json({
    status: "success",
    data: orders,
  });
});

exports.createOrder = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { cart } = user;
  const orderAddress = await user.address.find((address) =>
    address._id.equals(req.body.address_id)
  );
  if (cart.length < 1) {
    return next(new ApiError("Cart is Empty", 400));
  }
  if (!orderAddress) return next(new ApiError("Address Not Found", 404));
  const products = cart.map((product) => {
    const { product_id, quantity, price } = product;
    return {
      product_id,
      quantity,
      price,
    };
  });

  console.log("Products: ", products);
  const total_price = products.reduce((acc, product) => acc + product.price, 0);

  console.log("Total Price: ", total_price);
  const order = new Order({
    user_id: req.user.id,
    products,
    total_price,
    address: orderAddress,
  });
  console.log("Order: ", order);
  await order.save();
  // Clear the user's cart
  user.cart = [];
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    data: order,
  });
});
