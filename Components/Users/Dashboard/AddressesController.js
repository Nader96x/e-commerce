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
//
// exports.getAddress = AsyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.params.id);
//   if (!user) {
//     return next(new Error("User Not Found"));
//   }
//   const address = await user.address.filter(
//     (el) => el._id == req.params.address
//   );
//   if (address.length === 0) {
//     return next(new Error("Address Not Found"));
//   }
//   res.status(200).json({
//     status: "success",
//     data: address,
//   });
// });
//
// exports.addAddress = AsyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.params.id);
//   if (!user) {
//     return next(new ApiError("User Not Found", 404));
//   }
//   await user.address.push(req.body);
//   await user.save();
//   res.status(201).json({
//     status: "success",
//     data: user,
//   });
// });
//
// exports.updateAddress = AsyncHandler(async (req, res, next) => {
//   const userId = req.params.id;
//   const addressId = req.params.address;
//   const user = await User.findById(userId);
//   if (!user) {
//     return next(new ApiError("User Not Found", 404));
//   }
//   const userAddress = await user.address.find((address) =>
//     address._id.equals(addressId)
//   );
//   if (!userAddress) {
//     return next(new ApiError("Address Not Found", 404));
//   }
//   Object.assign(userAddress, req.body);
//   await user.save();
//   res.status(200).json({
//     status: "success",
//     data: user,
//   });
// });
//
// exports.deleteAddress = AsyncHandler(async (req, res, next) => {
//   const userId = req.params.id;
//   const addressId = req.params.address;
//   const user = await User.findById(userId);
//   if (!user) {
//     return next(new ApiError("User Not Found", 404));
//   }
//   const userAddress = await user.address.find((address) =>
//     address._id.equals(addressId)
//   );
//   if (!userAddress) {
//     return next(new ApiError("Address Not Found", 404));
//   }
//   const addressIndex = await user.address.findIndex(
//     ({ _id }) => _id == addressId
//   );
//   await user.address.splice(addressIndex, 1);
//   await user.save({ validateBeforeSave: true });
//   res.status(200).json({
//     status: "success",
//     data: {
//       user,
//     },
//   });
// });
