const express = require("express");
const categoryController = require("./CategoriesController");
const upload = require("../../helpers/upload.helper");
const {
  validateCategoryId,
  validateCreateCategory,
  validateUpdateCategory,
} = require("./CategoriesValidation");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file?.location) {
    req.body.image = req.file.location;
  } else {
    delete req.body.image;
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
