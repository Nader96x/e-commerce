const Product = require("./Product");
const Factory = require("../../Utils/Factory");

exports.getAllProducts = Factory.getAll(Product);

exports.getOneProduct = Factory.getOne(Product);

exports.addProduct = Factory.createOne(Product);

exports.updateProduct = Factory.updateOne(Product);

exports.deleteProduct = Factory.deleteOne(Product);
