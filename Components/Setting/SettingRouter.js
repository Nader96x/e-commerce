const { Router } = require("express");
const SettingController = require("./SettingController");
const upload = require("../../helpers/upload.helper");
const { validateSetting } = require("./SettingValidation");

const assignImage = (req, res, next) => {
  console.log("body", req.body);
  console.log("req.files", req.files);

  if (req.files?.logo) {
    req.body.logo = req.files.logo[0].location;
  }
  if (req.files.banners) {
    req.body.banners = req.files.banners.map((img, i) => {
      return {
        image: img.location,
        alt: req.body.banners[i]?.alt,
        link: req.body.banners[i]?.link,
      };
    });
    req.body.banners = req.body.banners.filter((obj) => obj.link);
  }
  next();
};

const SettingRouter = Router();

SettingRouter.get("/", SettingController.getSettings);
SettingRouter.patch(
  "/",
  // upload.single("logo"),
  // field logo and array banners
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banners", maxCount: 10 },
  ]),
  // upload.any(),
  assignImage,
  validateSetting,
  SettingController.updateSetting
);

module.exports = SettingRouter;
