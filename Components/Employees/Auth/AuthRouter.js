const { Router } = require("express");
const AuthController = require("./AuthController");
const Recaptcha = require("express-recaptcha").RecaptchaV3;

const AuthRouter = Router();

const recaptcha = new Recaptcha(
  process.env.RECAPTCHA_SITEKEY,
  process.env.RECAPTCHA_SECRET
);
const recaptchaMW = (req, res, next) => {
  console.log("recaptchaMW");
  // if (process.env.NODE_ENV === "development") return next();
  if (req.recaptcha.error) {
    console.log("recaptchaMW error");
    return res.status(400).json({ status: "fail", message: "Invalid Captcha" });
  }
  console.log("recaptchaMW success");

  next();
};

AuthRouter.post("/auth", AuthController.login);
AuthRouter.post(
  "/reset-password-token",
  recaptcha.middleware.verify,
  recaptchaMW,
  AuthController.resetPasswordToken
);
AuthRouter.post("/reset-password", AuthController.resetPassword);

module.exports = AuthRouter;
