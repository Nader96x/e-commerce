const express = require("express");
const productController = require("./ProductsController");
const upload = require("../../helpers/upload.helper");

const router = express.Router();

const assignImages = (req, res, next) => {
  // eslint-disable-next-line array-callback-return
  // console.log(req.files, "files");
  if (req.files.image && req.files.image.length)
    req.body.image = req.files.image[0].location;
  req.body.images = [];
  if (req.files.images && req.files.images.length)
    // eslint-disable-next-line array-callback-return
    req.files.images.map((file) => {
      req.body.images.push(file.location);
    });

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
    productController.addProduct
  );

router
  .route("/:id")
  .get(productController.getOneProduct)
  .patch(
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "images", maxCount: 6 },
    ]),
    assignImages,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;
