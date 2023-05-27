const express = require('express');
const categoryController = require('./CategoriesController');
const router = express.Router();

router
    .route("/")
    .get(categoryController.getAllCategories)
    .post(categoryController.createCategory);

router
    .route("/:id")
    .get(categoryController.getOneCategory)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

module.exports = router;