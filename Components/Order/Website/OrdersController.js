const AsyncHandler = require("express-async-handler");
const Pusher = require("pusher");
const Order = require("../Order");
const User = require("../../Users/User");
const ApiError = require("../../../Utils/ApiError");
const ApiFeatures = require("../../../Utils/ApiFeatures");

const pusher = new Pusher({
  appId: "1618578",
  key: "0fc4fc03768ac1db6774",
  secret: "04a7344b0bc8b36670db",
  cluster: "eu",
  useTLS: true,
});

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

  // Notify admins using Pusher
  const notificationMessage = "New order received";
  pusher.trigger("admin-channel", "new-order", {
    message: notificationMessage,
    order: order,
  });

  res.status(201).json({
    status: "success",
    data: order,
  });
});

exports.cancelOrder = AsyncHandler(async (req, res, next) => {
  const filter = { user_id: req.user.id };
  const order = await Order.findOneAndUpdate(filter, { status: "Cancelled" });

  res.status(200).json({
    status: "success",
    data: order,
  });
});
