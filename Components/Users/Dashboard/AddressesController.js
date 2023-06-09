const AsyncHandler = require("express-async-handler");
const User = require("../User");
const ApiError = require("../../../Utils/ApiError");

exports.getAllAddresses = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ApiError("User Not Found", 404));
  }
  const addresses = user.address;
  res.status(200).json({
    status: "success",
    data: addresses,
  });
});

exports.getAddress = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new Error("User Not Found"));
  }
  const address = await user.address.filter(
    (el) => el._id == req.params.address
  );
  if (address.length === 0) {
    return next(new Error("Address Not Found"));
  }
  res.status(200).json({
    status: "success",
    data: address,
  });
});
