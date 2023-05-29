const express = require("express");
const categoryController = require("./CategoriesController");
const upload = require("../../helpers/upload.helper");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.location;
  }
  next();
};

const imageUpload = (req, res, next) => {
  if (req.file) upload.single("image");
  next();
};

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(imageUpload, assignImage, categoryController.createCategory)
  .delete(categoryController.deleteAllCategories);

router
  .route("/:id")
  .get(categoryController.getOneCategory)
  .patch(imageUpload, assignImage, categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
