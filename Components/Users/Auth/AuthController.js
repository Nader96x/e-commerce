const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../User");
const ApiError = require("../../../Utils/ApiError");
const Email = require("../../../Utils/emailSender");

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = AsyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    phone: req.body.phone,
    bio: req.body.bio,
    address: req.body.address,
    image: req.body.image,
  });
  const token = createToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});

exports.login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError("Please enter your data", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = createToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

exports.protect = AsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("Please login first", 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ApiError("User no longer Exists", 401));
  }
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new ApiError("Password changed recently, login again", 401));
  }
  req.user = user;
  next();
});

exports.forgotPassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No User Found with this email", 404));
  }
  const token = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${token}`;
  const email = new Email(user, resetURL);
  try {
    await email.sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: "Please check your email",
    });
  } catch (err) {
    user.reset_password_token = null;
    user.reset_password_token_expire = null;
    await user.save({ validateBeforeSave: false });
    return next(new ApiError("Failed to send email", 500));
  }
});

exports.resetPassword = AsyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    reset_password_token: hashedToken,
    reset_password_token_expire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Token is Invalid or has Expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.reset_password_token = null;
  user.reset_password_token_expire = null;
  await user.save();
  const token = createToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
