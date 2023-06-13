const AsyncHandler = require("express-async-handler");
const Order = require("../Order");
const User = require("../../Users/User");
const ApiError = require("../../../Utils/ApiError");
const ApiFeatures = require("../../../Utils/ApiFeatures");

exports.getOrders = AsyncHandler(async (req, res, next) => {
  const documentsCount = await Order.find({
    user_id: req.user.id,
  }).countDocuments();
  const apiFeatures = new ApiFeatures(
    req.query,
    Order.find({ user_id: req.user.id })
  );
  // else apiFeatures = new ApiFeatures(query, Model.find(filter));
  apiFeatures.paginate(documentsCount).filter().sort().limitFields().search();

  const { mongooseQuery, paginationResult: pagination } = apiFeatures;
  /** execute query  */
  const documents = await mongooseQuery;
  res
    .status(200)
    .json({ result: documents.length, pagination, data: documents });
});

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

  res.status(200).json({
    status: "success",
    data: order,
  });
});