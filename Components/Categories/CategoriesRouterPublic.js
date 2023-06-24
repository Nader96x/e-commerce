const express = require("express");
const CategoriesController = require("./CategoriesController");
const Category = require("./Category");
const ApiError = require("../../Utils/ApiError");

const filterActive = (req, res, next) => {
  req.query.is_active = true;
  next();
};

const filterByCat = async (req, res, next) => {
  const cat = await Category.findOne({ slug: req.params.slug }).exec();
  if (!cat) {
    return next(new ApiError("No Category Found", 400));
  }
  req.query.category_id = cat._id;
  req.query.is_active = true;
  next();
};

const router = express.Router();

router.get("/", filterActive, CategoriesController.getPublicCategories);
// router.get("/:slug/products", CategoriesController.getProductsByCategory);
router.get(
  "/:slug/products",
  filterByCat,
  CategoriesController.getPublicProducts
);
router.get("/:slug", CategoriesController.getOneCategoryBySlug);

module.exports = router;
