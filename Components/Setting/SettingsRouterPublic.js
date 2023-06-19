const express = require("express");
const SettingController = require("./SettingController");

const router = express.Router();

// router.get("/", SettingController.getSettings);
router.get("/banners", SettingController.banners);
router.get("/terms", SettingController.terms);
router.get("/contact-us", SettingController.contact_us);
router.get("/about-us", SettingController.about_us);
router.get("/info", SettingController.info);

module.exports = router;
