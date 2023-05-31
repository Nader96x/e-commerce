const Category = require("./Category");
const Product = require("../Products/Product");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: "success",
      results: categories.length,
      data: categories,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error: ${err}`,
    });
  }
};

exports.getOneCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Error: ${err}`,
    });
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json({
      status: "success",
      data: newCategory,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error: ${err}`,
    });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Error: ${err}`,
    });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      status: "404",
      message: `Error: ${err}`,
    });
  }
};

exports.deleteAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.deleteMany();
    res.status(204).json({
      status: "success",
      data: categories,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error: ${err}`,
    });
  }
};

exports.searchCategoryByName = async (req, res, next) => {
  try {
    const { name } = req.body;
    const regex = new RegExp(name, "i");
    const products = await Category.find({
      $or: [{ name_en: regex }, { name_ar: regex }],
    });
    if (products.length <= 0) {
      return next(new Error("Categories not Found"));
    }
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Categories not Found",
    });
  }
};
