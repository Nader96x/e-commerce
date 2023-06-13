const express = require("express");
const productController = require("./ProductsController");

const router = express.Router();

router.get(
  "/",
  (req, res, next) => {
    req.body.is_active = true;
    next();
  },
  productController.getPublicProducts
);
router.get("/:slug", productController.getOneProductBySlug);

module.exports = router;
