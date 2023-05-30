const express = require("express");
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} = require("./RoulesController");

const router = express.Router();

router.route("/").get(getRoles).post(createRole);
router.route("/:id").get(getRole).patch(updateRole).delete(deleteRole);

module.exports = router;
