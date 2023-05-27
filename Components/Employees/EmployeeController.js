const Employee = require("./Employee");

module.exports.getAllEmployees = async (req, res, nex) => {
  try {
    const employees = await Employee.find().exec();
    res.status(200).json({ status: "success", data: employees });
  } catch (error) {
    res.status(400).json({ error });
  }
};
