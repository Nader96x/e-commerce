const express = require("express");
const productController = require("./ProductsController");
const upload = require("../../helpers/upload.helper");

const router = express.Router();
const assignImage = (req, res, next) => {
  req.body.image = req.file.location;
  next();
};

const assignImages = (req, res, next) => {
  // eslint-disable-next-line array-callback-return
  req.files.map((file) => {
    req.body.images.push(file.location);
  });
  next();
};

router
  .route("/")
  .get(productController.getAllProducts)
  .post(upload.single("image"), assignImage, productController.addProduct);

router
  .route("/:id")
  .get(productController.getOneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
