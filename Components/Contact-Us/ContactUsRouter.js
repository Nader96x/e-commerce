const express = require("express");
const { getContactUs, createContactUs } = require("./ContactUsController");

const router = express.Router();

router.route("/").get(getContactUs).post(createContactUs);

module.exports = router;
