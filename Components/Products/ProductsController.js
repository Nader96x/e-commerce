const AsyncHandler = require("express-async-handler");
const Product = require("./Product");
const Category = require("../Categories/Category");
const ApiFeatures = require("../../Utils/ApiFeatures");
const ApiError = require("../../Utils/ApiError");

exports.getAllProducts = AsyncHandler(async (req, res) => {
  let filter = {};
  if (req.body.category_id) filter = { category_id: req.body.category_id };
  const documentsCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(
    req.query,
    Product.find(filter).populate("category_id")
  );
  apiFeatures.paginate(documentsCount).filter().sort().limitFields().search();
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;
  res.status(200).json({
    status: "success",
    results: products.length,
    pages: paginationResult,
    data: products,
  });
});

exports.getOneProduct = AsyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category_id");
  if (!product) {
    return next(new ApiError("Product Not Found", 404));
  }
  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.addProduct = AsyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category_id);
  if (!category) {
    return next(new ApiError("No Category was Found for this ID", 404));
  }
  const product = await Product.create(req.body);
  if (!product) {
    return next(new ApiError("Something Went Wrong", 400));
  }
  res.status(201).json({
    status: "success",
    data: product,
  });
});

exports.updateProduct = AsyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("category_id");
  if (!product) {
    return next(new ApiError("Update Failed, Something Went Wrong", 400));
  }
  res.status(200).json({
    status: "success",
    data: product,
  });
});

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
