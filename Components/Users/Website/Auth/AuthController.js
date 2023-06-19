const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../../User");
const ApiError = require("../../../../Utils/ApiError");
const Email = require("../../../../Utils/emailSender");

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res, next) => {
  const token = createToken(user._id);
  if (!token) {
    return next(new ApiError("Error creating JWT token", 500));
  }
  res.status(statusCode).json({
    status: "success",
    data: { user, token },
  });
};

const createVerifyToken = async (user, req, res, next) => {
  const token = await user.createEmailVerificationToken();
  user.save({ validateBeforeSave: false });
  const verifyUrl = `http://localhost:3000/verify-email/${token}`;
  const email = new Email(user, verifyUrl);
  try {
    await email.sendWelcome();
    return user;
  } catch (err) {
    user.email_token = undefined;
    return next(new ApiError("Failed to send email", 500));
  }
};

const createLogoutToken = (statusCode, res, next) => {
  const token = createToken(Date.now());
  if (!token) {
    return next(new ApiError("Error creating JWT token", 500));
  }
  process.env.JWT_EXPIRES_IN = "30d";
  res.status(statusCode).json({
    status: "success",
    data: { token },
  });
};

const createHashedToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

exports.signup = AsyncHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const user = await createVerifyToken(newUser, req, res, next);
  createSendToken(user, 201, res, next);
});

exports.login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  if (!user.is_active)
    return next(
      new ApiError("This account is Not Active, please contact us", 401)
    );

  const loggedUser = user.toJSON();
  delete loggedUser.password;
  createSendToken(loggedUser, 200, res, next);
});

exports.protect = AsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
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
  if (!user.is_active) {
    return next(
      new ApiError("This account is Not Active, please contact us", 401)
    );
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
  const resetURL = `http://localhost:3000/reset-password/${token}`;
  const email = new Email(user, resetURL);
  try {
    await email.sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: "Please check your email",
    });
  } catch (err) {
    user.reset_password_token = undefined;
    user.reset_password_token_expire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ApiError("Failed to send email", 500));
  }
});

exports.resetPassword = AsyncHandler(async (req, res, next) => {
  const hashedToken = createHashedToken(req.params.token);
  const user = await User.findOne({
    reset_password_token: hashedToken,
    reset_password_token_expire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Token is Invalid or has Expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.reset_password_token = undefined;
  user.reset_password_token_expire = undefined;
  await user.save();
  createSendToken(user, 200, res, next);
});

exports.updatePassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.checkPassword(req.body.currentPassword, user.password))) {
    return next(new ApiError("Incorrect Password", 401));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  createSendToken(user, 200, res, next);
});

exports.logout = AsyncHandler(async (req, res, next) => {
  process.env.JWT_EXPIRES_IN = 120;
  createLogoutToken(200, res, next);
});

exports.verifyEmail = AsyncHandler(async (req, res, next) => {
  const hashedToken = createHashedToken(req.params.token);
  const user = await User.findOne({
    email_token: hashedToken,
  });
  if (!user) {
    return next(new ApiError("Token is Invalid or has Expired", 400));
  }
  user.verified_at = Date.now();
  user.email_token = undefined;
  await user.save({ validateBeforeSave: false });
  createSendToken(user, 200, res, next);
});

exports.sendNewVerificationCode = AsyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id);
  if (user.verified_at)
    return next(new ApiError("This Email Already Verified", 400));
  user = await createVerifyToken(user, req, res, next);
  createSendToken(user, 200, res, next);
});
