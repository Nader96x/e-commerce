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
  .delete(categoryController.deleteCategory);

module.exports = router;
