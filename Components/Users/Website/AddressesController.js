const AsyncHandler = require("express-async-handler");
const User = require("../User");
const ApiError = require("../../../Utils/ApiError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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
  if (
    !req.body.city ||
    !req.body.area ||
    !req.body.country ||
    !req.body.governorate
  ) {
    return next(new ApiError("Please Fill in All The Data", 400));
  }
  const user = await User.findById(req.user.id);
  const filtredObject = filterObj(
    req.body,
    "city",
    "area",
    "country",
    "governorate"
  );
  await user.address.push(filtredObject);
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
  const filtredObject = filterObj(
    req.body,
    "city",
    "area",
    "country",
    "governorate"
  );
  Object.assign(userAddress, filtredObject);
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
