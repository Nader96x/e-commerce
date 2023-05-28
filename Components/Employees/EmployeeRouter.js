const { Router } = require("express");
const EmployeeController = require("./EmployeeController");

const EmployeeRouter = Router();

EmployeeRouter.route("/")
  .get(EmployeeController.getAllEmployees)
  .post(EmployeeController.createEmployee);

EmployeeRouter.route("/:id")
  .get(EmployeeController.getEmployeeById)
  .patch(EmployeeController.updateEmployee)
  .delete(EmployeeController.deleteEmployee);
EmployeeRouter.post("/ban", EmployeeController.ban).post(
  "/unban",
  EmployeeController.unban
);

module.exports = EmployeeRouter;
