const { Router } = require("express");
const AuthController = require("./AuthController");
const FullRecaptchaMiddlewares = require("../../../MiddelWares/Recaptcha");
const { validateLogin } = require("../EmployeeValidation");

const AuthRouter = Router();

AuthRouter.post("/auth", validateLogin, AuthController.login);
AuthRouter.post(
  "/reset-password-token",
  FullRecaptchaMiddlewares,
  AuthController.resetPasswordToken
);
AuthRouter.post("/reset-password", AuthController.resetPassword);

module.exports = AuthRouter;
