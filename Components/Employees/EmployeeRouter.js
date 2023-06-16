const { Router } = require("express");
const EmployeeController = require("./EmployeeController");
const { protect, authorized } = require("./Auth/AuthController");
const {
  validateGetEmployeeById,
  validateUpdateEmployee,
  validateCreateEmployee,
  validateUpdatePassword,
} = require("./EmployeeValidation");

const EmployeeRouter = Router();
EmployeeRouter.route("/")
  .all(protect, authorized)
  .get(EmployeeController.getAllEmployees)
  .post(validateCreateEmployee, EmployeeController.createEmployee);

EmployeeRouter.patch(
  "/update-password",
  protect,
  validateUpdatePassword,
  EmployeeController.updatePassword
);

EmployeeRouter.route("/:id")
  .all(protect, authorized)
  .all(validateGetEmployeeById)
  .get(EmployeeController.getEmployeeById)
  .patch(validateUpdateEmployee, EmployeeController.updateEmployee)
  .delete(EmployeeController.deleteEmployee);
//
EmployeeRouter.post(
  "/:id/ban",
  protect,
  authorized,
  validateGetEmployeeById,
  EmployeeController.ban
);
EmployeeRouter.post(
  "/:id/unban",
  protect,
  authorized,
  validateGetEmployeeById,
  EmployeeController.unban
);

module.exports = EmployeeRouter;
