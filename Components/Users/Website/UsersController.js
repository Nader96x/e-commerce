const AsyncHandler = require("express-async-handler");
const User = require("../User");
const ApiError = require("../../../Utils/ApiError");

exports.getUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.update = AsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
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
