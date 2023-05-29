const express = require("express");
const categoryController = require("./CategoriesController");
const upload = require("../../helpers/upload.helper");

const router = express.Router();

const assignImage = (req, res, next) => {
  console.log(req.file.image);
  // if (req.file.image && req.file.image.length) {
  //   req.body.image = req.file.location;
  // }
  next();
};

const imageUpdate = (req, res, next) => {
  // if (req.file.image && req.file.image.length) upload.single("image");
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
  .patch(imageUpdate, assignImage, categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
