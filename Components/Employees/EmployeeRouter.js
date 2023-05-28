const { Router } = require("express");
const EmployeeController = require("./EmployeeController");

const EmployeeRouter = Router();

EmployeeRouter.get("/", EmployeeController.getAllEmployees).post(
  "/",
  EmployeeController.createEmployee
);

EmployeeRouter.get("/:id", EmployeeController.getEmployeeById)
  .patch("/:id", EmployeeController.updateEmployee)
  .delete("/:id", EmployeeController.deleteEmployee)
  .post("/:id/ban", EmployeeController.ban)
  .post("/:id/unban", EmployeeController.unban);

module.exports = EmployeeRouter;
