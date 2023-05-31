const { Router } = require("express");
const EmployeeController = require("./EmployeeController");
const { protect } = require("./Auth/AuthController");

const EmployeeRouter = Router();

EmployeeRouter.route("/")
  // .all(protect)
  .get(EmployeeController.getAllEmployees)
  .post(EmployeeController.createEmployee);

EmployeeRouter.route("/:id")
  .get(EmployeeController.getEmployeeById)
  .patch(EmployeeController.updateEmployee)
  .delete(EmployeeController.deleteEmployee);
//
EmployeeRouter.post("/:id/ban", EmployeeController.ban)
  .post("/:id/unban", EmployeeController.unban)
  .patch("/:id/update-password", EmployeeController.updatePassword);

module.exports = EmployeeRouter;
