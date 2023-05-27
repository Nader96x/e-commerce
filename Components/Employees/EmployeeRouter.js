const { Router } = require("express");
const EmployeeController = require("./EmployeeController");

const EmployeeRouter = Router();

EmployeeRouter.get("/", EmployeeController.getAllEmployees)
  .get("/:id", EmployeeController.getEmployeeById)
  .post("/", EmployeeController.createEmployee)
  .patch("/:id", EmployeeController.updateEmployee)
  .delete("/:id", EmployeeController.deleteEmployee);

module.exports = EmployeeRouter;
