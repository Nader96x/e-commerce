const Category = require("./Category");
const { uploadImage } = require('../../Utils/uploadImage');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
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
      data: {
        category,
      },
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
      data: {
        categories: newCategory,
      },
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
      data: {
        category,
      },
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
      data: {
        category: null,
      },
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
      data: {
        categories: categories,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error: ${err}`,
    });
  }
};
