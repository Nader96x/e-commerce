const { Router } = require("express");
const EmployeeController = require("./EmployeeController");

const EmployeeRouter = Router();

EmployeeRouter.get("/", EmployeeController.getAllEmployees)
  .get("/:id", EmployeeController.getEmployeeById)
  .post("/", EmployeeController.createEmployee)
  .patch("/:id", EmployeeController.updateEmployee)
  .delete("/:id", EmployeeController.deleteEmployee)
  .post("/:id/ban", EmployeeController.ban)
  .post("/:id/unban", EmployeeController.unban);

module.exports = EmployeeRouter;
