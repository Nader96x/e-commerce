const express = require("express");
const CategoriesController = require("./CategoriesController");

const router = express.Router();

router.get(
  "/",
  (req, res, next) => {
    req.body.is_active = true;
    next();
  },
  CategoriesController.getPublicCategories
);
router.get("/:slug/products", CategoriesController.getProductsByCategory);
router.get("/:slug", CategoriesController.getOneCategoryBySlug);

module.exports = router;
