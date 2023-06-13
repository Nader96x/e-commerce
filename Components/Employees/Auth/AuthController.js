const { verify } = require("jsonwebtoken");
const Employee = require("../EmployeeSchema");
const Email = require("../../../Utils/emailSender");

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email }).exec();
    console.log(process.env.NODE_ENV);
    if (!employee) {
      if (process.env.NODE_ENV === "development")
        console.log("Email not found");
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Credentials" });
    }
    const isMatch = await employee.checkPassword(password);
    if (!isMatch) {
      if (process.env.NODE_ENV === "development")
        console.log("Password not correct");
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Credentials" });
    }
    const token = await employee.generateToken();
    res
      .status(200)
      .json({ status: "success", data: { user: employee, token } });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const employee = req.user;
    employee.password_changed_at = Date.now() + 1000;
    await employee.save({ validateBeforeSave: false });
    res.status(200).json({ status: "success", data: null });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .json({ status: "fail", message: "You are not logged in" });
    }
    const decoded = await verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id).exec();
    if (!employee) {
      return res
        .status(401)
        .json({ status: "fail", message: "Employee no longer exists" });
    }
    if (employee.passwordChangedAfter(decoded.iat)) {
      return res
        .status(401)
        .json({ status: "fail", message: "Password changed recently" });
    }
    if (employee.is_banned) {
      return res
        .status(401)
        .json({ status: "fail", message: "You are banned" });
    }
    req.user = employee;
    next();
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.authorized = async (req, res, next) => {
  if (req.user.is_banned)
    return res.status(401).json({ status: "fail", message: "You are banned" });

  const employee = req.user;
  const { method } = req;
  const routes = req.originalUrl.split("/").slice(1);
  // console.log(method, routes, employee.role, employee.role_id, req.originalUrl);
  const isAuthorized = await employee.isAuthorized(method, routes);
  if (!isAuthorized) {
    return res
      .status(401)
      .json({ status: "fail", message: "You are not authorized" });
  }
  next();
};

module.exports.resetPasswordToken = async (req, res, next) => {
  const user = await Employee.findByEmail(req.body.email);
  if (!user) {
    return res.status(404).json({ status: "fail", message: "No user found" });
  }
  // console.log(req.body);
  const token = await user.createResetPasswordToken();
  // const resetURL = `${req.protocol}://${req.get("host")}/api/v1/employees/reset-password/${token}`;
  const resetURL = `http://localhost:3000/auth/reset-password/${token}`;
  const email = new Email(user, resetURL);
  await email.sendPasswordReset();
  if (process.env.NODE_ENV === "development")
    res.status(200).json({ status: "success", data: token });
  else res.status(200).json({ status: "success", data: null });
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { token: rest_token, password, password_confirm } = req.body;
    if (password !== password_confirm) {
      return res
        .status(400)
        .json({ status: "fail", message: "Passwords do not match" });
    }
    const user = await Employee.findByEmail(req.body.email);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "No user found" });
    }
    if (!user.checkResetToken(rest_token)) {
      return res.status(401).json({ status: "fail", message: "Invalid token" });
    }

    await user.changePassword(password);
    await user.save();
    const token = await user.generateToken();
    res.status(200).json({ status: "success", data: { user, token } });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};
