const AsyncHandler = require("express-async-handler");
const User = require("../User");
const ApiError = require("../../../Utils/ApiError");

exports.getAllAddresses = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const addresses = user.address;
  res.status(200).json({
    status: "success",
    data: addresses,
  });
});

exports.getAddress = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const address = await user.address.filter((el) => el._id == req.params.id);
  if (address.length === 0) {
    return next(new ApiError("Address Not Found", 404));
  }
  res.status(200).json({
    status: "success",
    data: address,
  });
});

exports.addAddress = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  await user.address.push(req.body);
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.updateAddress = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const userAddress = await user.address.find((address) =>
    address._id.equals(req.params.id)
  );
  if (!userAddress) {
    return next(new ApiError("Address Not Found", 404));
  }
  Object.assign(userAddress, req.body);
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteAddress = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const userAddress = await user.address.find((address) =>
    address._id.equals(req.params.id)
  );
  if (!userAddress) return next(new ApiError("Address Not Found", 404));

  if (user.address.length === 1)
    return next(new ApiError("Cannot Delete your Only Address", 400));

  const addressIndex = await user.address.findIndex(
    ({ _id }) => _id == req.params.id
  );
  await user.address.splice(addressIndex, 1);
  await user.save({ validateBeforeSave: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
