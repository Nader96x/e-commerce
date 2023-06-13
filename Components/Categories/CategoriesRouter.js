const express = require("express");
const categoryController = require("./CategoriesController");
const upload = require("../../helpers/upload.helper");
const {
  validateCategoryId,
  validateCreateCategory,
  validateUpdateCategory,
} = require("./CategoriesValidation");
const Product = require("../Products/Product");
const ApiError = require("../../Utils/ApiError");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.location;
  }
  next();
};

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    upload.single("image"),
    assignImage,
    validateCreateCategory,
    categoryController.createCategory
  );

router
  .route("/:id")
  .all(validateCategoryId)
  .get(categoryController.getOneCategory)
  .patch(
    upload.single("image"),
    assignImage,
    validateUpdateCategory,
    categoryController.updateCategory
  )
  .delete(async (req, res, next) => {
    const products = await Product.find({
      category_id: this._id,
    }).countDocuments();
    console.log(products);
    if (products > 0) {
      return next(
        new ApiError("Category Cannot Be Deleted, It Has Products", 400)
      );
    }
    next();
  }, categoryController.deleteCategory);

module.exports = router;
