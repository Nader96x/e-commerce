const Factory = require("../../Utils/Factory");
const Category = require("./Category");
const Product = require("../Products/Product");
const ApiError = require("../../Utils/ApiError");

exports.getAllCategories = Factory.getAll(Category);

exports.getOneCategory = Factory.getOne(Category);

exports.createCategory = Factory.createOne(Category);

exports.updateCategory = Factory.updateOne(Category);

exports.deleteCategory = Factory.deleteOne(Category);

exports.getPublicCategories = Factory.getAll(Category);

exports.getOneCategoryBySlug = Factory.getOneBySlug(Category);

exports.getProductsByCategory = async (req, res, next) => {
  const Cat = await Category.findOne({ slug: req.params.slug }).exec();
  if (!Cat) {
    return next(new ApiError("No Category Found", 400));
  }
  const products = await Product.find(
    {
      category_id: Cat._id,
      is_active: true,
    },
    {
      // images: 0,
      is_active: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      category_id: 0,
    }
  );
  if (!products) {
    return next(new ApiError("No Products Found in this Category.", 400));
  }
  res.status(200).json({
    status: "success",
    data: products,
  });
};
