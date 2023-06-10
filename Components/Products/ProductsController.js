const AsyncHandler = require("express-async-handler");
const Product = require("./Product");
const Category = require("../Categories/Category");
const ApiError = require("../../Utils/ApiError");
const Factory = require("../../Utils/Factory");

exports.getAllProducts = Factory.getAll(Product, "category_id");

exports.getOneProduct = Factory.getOne(Product, "category_id");

exports.addProduct = Factory.createOne(Product, Category, "category_id");

exports.updateProduct = Factory.updateOne(Product, "category_id");

exports.deleteProduct = AsyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (product.total_orders > 0) {
    return next(new ApiError("Product Cannot Be Deleted", 400));
  }
  product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ApiError("Delete Failed, Something Went Wrong", 400));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
