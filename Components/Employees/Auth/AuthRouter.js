const { Router } = require("express");
const AuthController = require("./AuthController");

const AuthRouter = Router();

AuthRouter.get("/auth", AuthController.login);

module.exports = AuthRouter;
