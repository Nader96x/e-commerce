const AsyncHandler = require("express-async-handler");
const ApiError = require("../../../Utils/ApiError");
const User = require("../User");
const Product = require("../../Products/Product");

exports.getCartProducts = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const cartProducts = user.cart;
  if (cartProducts.length <= 0) {
    return next(
      new ApiError("Cart is Empty, Please add some products first", 404)
    );
  }
  res.status(200).json({
    status: "success",
    data: cartProducts,
  });
});

exports.addProduct = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { cart } = user;
  if (req.body.quantity <= 0)
    return next(new ApiError(`Cannot add ${req.body.quantity} amount`, 400));
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
  const updatedCart = await cart.map((item) => {
    if (item.product_id == product_id) {
      if (item.quantity >= product.quantity) {
        return next(
          new ApiError(`Cannot Exceed Max Amount ${product.quantity}`, 400)
        );
      }
      item.quantity += quantity;
    }
    return item;
  });
  const productFound = await updatedCart.some(
    (item) => item.product_id == product_id
  );
  if (!productFound) {
    // eslint-disable-next-line camelcase
    updatedCart.push({ product_id, quantity });
  }
  user.cart = updatedCart;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: user.cart,
  });
});

exports.removeProduct = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { cart } = user;
  if (req.body.quantity <= 0)
    return next(new ApiError(`Invalid Quantity number`, 400));
  if (!req.body.quantity) req.body.quantity = 1;
  const { product_id, quantity } = req.body;
  const product = await Product.findById(product_id);
  if (!product) {
    return next(new ApiError("Product Not Found", 404));
  }
  const index = cart.findIndex((item) => item.product_id == product_id);
  if (index === -1) {
    return next(new ApiError("Product not found in cart", 400));
  }
  const item = cart[index];
  if (quantity > item.quantity) {
    return next(
      new ApiError(`Cannot remove more than ${item.quantity} from cart`, 400)
    );
  }
  item.quantity -= quantity;
  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }
  user.cart = cart;
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
