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
    if (req.body.password !== req.body.password_confirm)
      return res
        .status(400)
        .json({ status: "fail", message: "Passwords do not match" });
    // const employee = await Employee.findById(req.params.id).exec();
    const employee = req.user;
    console.log(employee);
    await employee.changePassword(req.body.password);
    const token = await employee.generateToken();

    res
      .status(200)
      .json({ status: "success", data: { user: employee, token } });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};
