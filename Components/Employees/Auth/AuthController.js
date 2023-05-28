const { verify } = require("jsonwebtoken");
const Employee = require("../EmployeeSchema");

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email }).exec();
    if (!employee) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Credentials1" });
    }
    console.log(employee);
    const isMatch = await employee.checkPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Credentials2" });
    }
    const token = await employee.generateToken();
    // const token = "await employee.generateToken()";
    res
      .status(200)
      .json({ status: "success", data: { ...employee.toJSON(), token } });
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
    req.user = employee;
    next();
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};
