const { Router } = require("express");
const EmployeeController = require("./EmployeeController");
const { protect, authorized } = require("./Auth/AuthController");
const { getEmployeeById } = require("./EmployeeValidation");

const EmployeeRouter = Router();
EmployeeRouter.all(protect, authorized);
EmployeeRouter.route("/")
  // .all(protect, authorized)
  .get(EmployeeController.getAllEmployees)
  .post(EmployeeController.createEmployee);

EmployeeRouter.patch(
  "/update-password",
  protect,
  EmployeeController.updatePassword
);

EmployeeRouter.route("/:id")
  // .all(protect, authorized)
  .all(getEmployeeById)
  .get(EmployeeController.getEmployeeById)
  .patch(EmployeeController.updateEmployee)
  .delete(EmployeeController.deleteEmployee);
//
EmployeeRouter.post(
  "/:id/ban",
  protect,
  authorized,
  EmployeeController.ban
).post("/:id/unban", protect, authorized, EmployeeController.unban);
// .patch("/:id/update-password", EmployeeController.updatePassword);

module.exports = EmployeeRouter;
