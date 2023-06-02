const AsyncHandler = require("express-async-handler");
const Category = require("./Category");
const Product = require("../Products/Product");
const ApiError = require("../../Utils/ApiError");
const ApiFeatures = require("../../Utils/ApiFeatures");

exports.getAllCategories = AsyncHandler(async (req, res) => {
  const documentsCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(req.query, Category.find());
  apiFeatures.paginate(documentsCount).filter().sort().limitFields().search();
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;
  res.status(200).json({
    status: "success",
    results: categories.length,
    pages: paginationResult,
    data: categories,
  });
});

exports.getOneCategory = AsyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ApiError("Category not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.createCategory = AsyncHandler(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  if (!newCategory) {
    return next(new ApiError("Something went Wrong", 400));
  }
  res.status(201).json({
    status: "success",
    data: newCategory,
  });
});

exports.updateCategory = AsyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new ApiError("Update Failed", 400));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.deleteCategory = AsyncHandler(async (req, res, next) => {
  const products = await Product.find({ category_id: req.params.id });
  if (products.length > 0) {
    return next(new ApiError("Cannot delete category with products", 400));
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new ApiError("Something went Wrong", 400));
  }
  res.status(204).json({
    status: "success",
    data: category,
  });
});
