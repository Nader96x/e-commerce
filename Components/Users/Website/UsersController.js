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

exports.updateMe = AsyncHandler(async (req, res, next) => {
  if (req.body.address) {
    return next(new ApiError("You cannot update your Address from here", 400));
  }
  if (req.body.password || req.body.confirmPassword) {
    return next(new ApiError("You cannot update your Password from here", 400));
  }
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "phone",
    "image",
    "bio"
  );
  const user = User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: user,
  });
});
