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

exports.getUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.update = AsyncHandler(async (req, res, next) => {
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
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  const token = req.headers.authorization.split(" ")[1];
  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});

exports.delete = AsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { is_active: false },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    return next(new ApiError("something went wrong", 400));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
