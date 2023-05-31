const { Router } = require("express");
const SettingController = require("./SettingController");
const upload = require("../../helpers/upload.helper");

const assignImage = (req, res, next) => {
  if (req.file) {
    req.body.logo = req.file.location;
  }
  next();
};

const SettingRouter = Router();

SettingRouter.get("/", SettingController.getSettings);
SettingRouter.patch(
  "/",
  upload.single("logo"),
  assignImage,
  SettingController.updateSetting
);

module.exports = SettingRouter;
