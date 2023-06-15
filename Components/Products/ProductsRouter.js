const express = require("express");
const productController = require("./ProductsController");
const upload = require("../../helpers/upload.helper");
const {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
} = require("./ProductsValidation");

const router = express.Router();

const assignImages = (req, res, next) => {
  // console.log("files", req.files);
  if (req.files) {
    if (req.files.image?.length && req.files.image[0]?.location)
      req.body.image = req.files.image[0].location;
    else {
      delete req.body.image;
    }
    if (req.files.images?.length) {
      req.body.images = [];
      // eslint-disable-next-line array-callback-return
      req.files.images.map((file) => {
        req.body.images.push(file.location);
      });
    } else {
      delete req.body.images;
    }
  }
  next();
};

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "images", maxCount: 6 },
    ]),
    assignImages,
    validateCreateProduct,
    productController.addProduct
  );

router
  .route("/:id")
  .all(validateProductId)
  .get(productController.getOneProduct)
  .patch(
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "images", maxCount: 6 },
    ]),
    assignImages,
    validateUpdateProduct,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;
