const { Router } = require("express");
const AuthController = require("./AuthController");

const AuthRouter = Router();

AuthRouter.get("/auth", AuthController.login);
AuthRouter.post("/reset-password-token", AuthController.resetPasswordToken);
AuthRouter.post("/reset-password", AuthController.resetPassword);

module.exports = AuthRouter;
