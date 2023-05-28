const { Router } = require("express");
const SettingController = require("./SettingController");

const SettingRouter = Router();

SettingRouter.get("/", SettingController.getSettings);
SettingRouter.patch("/", SettingController.updateSetting);

module.exports = SettingRouter;
