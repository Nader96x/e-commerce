const AsyncHandler = require("express-async-handler");
const User = require("../User");
const Order = require("../../Order/Order");
const ApiError = require("../../../Utils/ApiError");
const ApiFeatures = require("../../../Utils/ApiFeatures");

exports.getAllUsers = AsyncHandler(async (req, res) => {
  const documentsCount = await User.countDocuments();
  const apiFeatures = new ApiFeatures(
    req.query,
    User.find().select("+is_active")
  );
  apiFeatures.paginate(documentsCount).filter().sort().limitFields().search();
  const { mongooseQuery, paginationResult } = apiFeatures;
  const users = await mongooseQuery;
  res.status(200).json({
    status: "success",
    results: users.length,
    pages: paginationResult,
    data: users,
  });
});

exports.getUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("+is_active");
  if (!user) {
    return next(new ApiError("User Not Found", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.createUser = AsyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  if (!user) {
    return next(new ApiError("Something went wrong", 400));
  }
  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.updateUser = AsyncHandler(async (req, res, next) => {
  if (req.body.address) {
    return next(new ApiError("Admin Cannot Update Users Address", 400));
  }
  if (req.body.password || req.body.confirmPassword) {
    return next(new ApiError("Admin Cannot Update Users password", 400));
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new ApiError("something went wrong", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteUser = AsyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.params.id });
  if (orders.length > 0) {
    return next(new ApiError("Cannot delete User with Orders", 400));
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ApiError("User Not Found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.activateUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { is_active: true },
    {
      new: true,
      runValidators: true,
    }
  ).select("+is_active");
  if (!user) {
    return next(new ApiError("something went wrong", 400));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deActivateUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  ).select("+is_active");
  if (!user) {
    return next(new ApiError("something went wrong", 400));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
