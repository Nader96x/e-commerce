const { Router } = require("express");
const SettingController = require("./SettingController");
const upload = require("../../helpers/upload.helper");
const { validateSetting } = require("./SettingValidation");

const assignImage = (req, res, next) => {
  console.log("body", req.body);
  console.log("req.file", req.file);
  console.log("req.files", req.files);

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
  // upload.fields([{ name: "logo", maxCount: 1 }, { name: "banners.*.image" }]),
  // upload.any(),
  assignImage,
  validateSetting,
  SettingController.updateSetting
);

module.exports = SettingRouter;
