const AsyncHandler = require("express-async-handler");
const Product = require("./Product");
const Factory = require("../../Utils/Factory");
const ApiError = require("../../Utils/ApiError");

exports.getAllProducts = Factory.getAll(Product);

exports.getOneProduct = Factory.getOne(Product);

exports.addProduct = Factory.createOne(Product);

exports.updateProduct = Factory.updateOne(Product);

exports.deleteProduct = Factory.deleteOne(Product);

exports.activateProduct = Factory.activate(Product);

exports.deActivateProduct = Factory.deActivate(Product);

exports.getProductsByCategory = AsyncHandler(async (req, res, next) => {
  const products = await Product.find({ category_id: req.params.id });
  if (!products) {
    return next(new ApiError("No Products Found", 400));
  }
  res.status(200).json({
    status: "success",
    data: products,
  });
});

exports.getPublicProducts = Factory.getAll(Product);
exports.getOneProductBySlug = Factory.getOneBySlug(Product);
