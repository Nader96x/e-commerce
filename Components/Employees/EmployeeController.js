const Employee = require("./EmployeeSchema");
const Factory = require("../../Utils/Factory");
const RoleModel = require("../Roles/Role");

module.exports.getAllEmployees = Factory.getAll(Employee);

module.exports.getEmployeeById = Factory.getOne(Employee);

module.exports.createEmployee = Factory.createOne(Employee);

module.exports.updateEmployee = Factory.updateOne(Employee);

module.exports.deleteEmployee = Factory.deleteOne(Employee);

module.exports.ban = Factory.ban(Employee);

module.exports.unban = Factory.unban(Employee);

module.exports.updatePassword = async (req, res, next) => {
  try {
    const { password, new_password } = req.body;
    if (password === new_password) {
      return res.status(400).json({
        status: "fail",
        message: "New password can't be the same as old password.",
      });
    }
    const employee = req.user;
    const isMatch = await employee.checkPassword(password);
    if (!isMatch) {
      if (process.env.NODE_ENV === "development")
        console.log("Password not correct");
      return res
        .status(400)
        .json({ status: "fail", message: "Password is not correct." });
    }
    console.log(employee);
    await employee.changePassword(new_password);
    const token = await employee.generateToken();

    res
      .status(200)
      .json({ status: "success", data: { user: employee, token } });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};
