const { Router } = require("express");
const EmployeeController = require("./EmployeeController");

const EmployeeRouter = Router();

EmployeeRouter.get("/", EmployeeController.getAllEmployees);

module.exports = EmployeeRouter;
