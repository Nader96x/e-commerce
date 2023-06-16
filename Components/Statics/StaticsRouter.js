const express = require("express");
const StaticsController = require("./StaticsController");

const router = express.Router();

router.get("/", StaticsController.getStatics);

module.exports = router;
