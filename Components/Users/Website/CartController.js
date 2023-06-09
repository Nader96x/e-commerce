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
  const user = await User.findById(req.user.id).populate("cart.product_id");
  const { cart } = user;
  if (!req.body.quantity) req.body.quantity = 1;
  // eslint-disable-next-line camelcase,prefer-const
  let { product_id, quantity } = req.body;
  const product = await Product.findById(product_id);
  if (
    !product ||
    !product.category_id.is_active ||
    !product.is_active ||
    product.quantity <= 0
  ) {
    return next(
      new ApiError("Product Cannot be Added To Cart at the Moment", 400)
    );
  }
  if (quantity > product.quantity) {
    return next(new ApiError(`Max amount to Add is ${product.quantity}`, 400));
  }
  const { name_en, image, name_ar, desc_ar } = product;
  const updatedCart = await cart.map((item) => {
    if (item.product_id._id == product_id) {
      if (item.quantity >= product.quantity) {
        return next(
          new ApiError(`Cannot Exceed Max Amount ${product.quantity}`, 400)
        );
      }
      item.quantity += quantity;
      item.price = product.price;
      item.name_en = product.name_en;
      item.name_ar = product.name_ar;
      item.desc_ar = product.desc_ar;
      item.image = product.image;
    }
    return item;
  });
  const productFound = await updatedCart.some(
    (item) => item.product_id._id == product_id
  );
  if (!productFound) {
    const { price } = product;
    // eslint-disable-next-line camelcase
    product_id = await Product.findById(product_id);
    updatedCart.push({
      product_id,
      quantity,
      price,
      name_en,
      name_ar,
      desc_ar,
      image,
    });
  }
  user.cart = updatedCart;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: user.cart,
  });
});

exports.updateQuantity = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("cart.product_id");
  const { cart } = user;
  // eslint-disable-next-line camelcase
  const { product_id, quantity } = req.body;
  const product = await Product.findById(product_id);
  if (!product) return next(new ApiError("Product Not Found", 404));
  const { name_en, image, name_ar, desc_ar } = product;
  if (quantity > product.quantity) {
    return next(new ApiError(`Max amount to Add is ${product.quantity}`, 400));
  }
  if (!product.is_active || !product.category_id.is_active)
    return next(new ApiError("Product not Available", 400));
  const updatedCart = await cart.map((item) => {
    // eslint-disable-next-line camelcase
    if (item.product_id._id == product_id) {
      item.quantity = quantity;
      item.price = product.price;
      item.name_en = name_en;
      item.name_ar = name_ar;
      item.desc_ar = desc_ar;
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
  const user = await User.findById(req.user.id).populate("cart.product_id");
  const { cart } = user;
  user.cart = cart.filter((item) => item.product_id._id != product_id);
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
