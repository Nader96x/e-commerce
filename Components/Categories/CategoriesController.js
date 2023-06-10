const Factory = require("../../Utils/Factory");
const Category = require("./Category");
const Product = require("../Products/Product");

exports.getAllCategories = Factory.getAll(Category);

exports.getOneCategory = Factory.getOne(Category);

exports.createCategory = Factory.createOne(Category);

exports.updateCategory = Factory.updateOne(Category);

exports.deleteCategory = Factory.deleteOne(Category, Product, "category_id");
