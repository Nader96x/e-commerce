const Employee = require("./EmployeeSchema");

module.exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().exec();
    res.status(200).json({ status: "success", data: employees });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.getEmployeeById = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const employee = await Employee.findById(req.params.id).exec();
    res.status(200).json({ status: "success", data: employee });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.createEmployee = async (req, res, next) => {
  try {
    console.log(req.body);
    const employee = await Employee.create(req.body);
    res.status(201).json({ status: "success", data: employee });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).exec();
    res.status(200).json({ status: "success", data: employee });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

module.exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id).exec();
    res.status(200).json({ status: "success", data: employee });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};
