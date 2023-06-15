const AsyncHandler = require("express-async-handler");
const ApiError = require("../../../Utils/ApiError");
const User = require("../User");
const Product = require("../../Products/Product");

exports.getCartProducts = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("cart.product_id");
  res.status(200).json({
    status: "success",
    data: user.cart,
  });
});

exports.addProduct = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { cart } = user;
  if (!req.body.quantity) req.body.quantity = 1;
  // eslint-disable-next-line camelcase
  const { product_id, quantity } = req.body;
  const product = await Product.findById(product_id);
  if (!product || !product.is_active || product.quantity <= 0) {
    return next(new ApiError("Product Cannot be Added To Cart", 400));
  }
  if (quantity > product.quantity) {
    return next(new ApiError(`Max amount to Add is ${product.quantity}`, 400));
  }
  const { name_en, image } = product;
  const updatedCart = await cart.map((item) => {
    if (item.product_id == product_id) {
      if (item.quantity >= product.quantity) {
        return next(
          new ApiError(`Cannot Exceed Max Amount ${product.quantity}`, 400)
        );
      }
      item.quantity += quantity;
      item.price = product.price * item.quantity;
      item.name_en = product.name_en;
      item.image = product.image;
    }
    return item;
  });
  const productFound = await updatedCart.some(
    (item) => item.product_id == product_id
  );
  if (!productFound) {
    const price = product.price * quantity;
    // eslint-disable-next-line camelcase
    updatedCart.push({ product_id, quantity, price, name_en, image });
  }
  user.cart = updatedCart;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: user.cart,
  });
});

exports.updateQuantity = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { cart } = user;
  // eslint-disable-next-line camelcase
  const { product_id, quantity } = req.body;
  const product = await Product.findById(product_id);
  if (!product) return next(new ApiError("Product Not Found", 404));
  const { name_en, image } = product;
  if (quantity > product.quantity) {
    return next(new ApiError(`Max amount to Add is ${product.quantity}`, 400));
  }
  const updatedCart = await cart.map((item) => {
    // eslint-disable-next-line camelcase
    if (item.product_id == product_id) {
      item.quantity = quantity;
      item.price = product.price * item.quantity;
      item.name_en = name_en;
      item.image = image;
    }
    return item;
  });
  user.cart = updatedCart;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: user.cart,
  });
});

exports.removeProduct = AsyncHandler(async (req, res, next) => {
  // eslint-disable-next-line camelcase
  const { product_id } = req.body;
  const user = await User.findById(req.user.id);
  const { cart } = user;
  user.cart = cart.filter((item) => item.product_id != product_id);
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: user.cart,
  });
});

exports.emptyCart = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.cart = [];
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: user.cart,
  });
});
