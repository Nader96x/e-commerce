const express = require("express");
const categoryController = require("./CategoriesController");
const upload = require("../../helpers/upload.helper");

const router = express.Router();

const assignImage = (req, res, next) => {
  if (req.file) {
    if (req.file.image) {
      req.body.image = req.file.location;
    }
  }
  next();
};

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(upload.single("image"), assignImage, categoryController.createCategory)
  .delete(categoryController.deleteAllCategories);

router
  .route("/:id")
  .get(categoryController.getOneCategory)
  .patch(upload.single("image"), assignImage, categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
