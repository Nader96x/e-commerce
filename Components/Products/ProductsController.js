const Product = require("./Product");

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("category_id");
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category_id"
    );
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category_id");
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.total_orders > 0) {
      return res.status(400).json({
        status: "fail",
        message: "Product Cannot Be Deleted",
      });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
