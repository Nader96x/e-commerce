const express = require("express");
const SettingController = require("./SettingController");

const router = express.Router();

// router.get("/", SettingController.getSettings);
router.get("/banners", SettingController.banners);

module.exports = router;
