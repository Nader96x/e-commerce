const express = require("express");
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} = require("./RoulesController");
const roleSchema = require("./RolesValidation");
const { validateSchema } = require("../../Utils/Validation");

const router = express.Router();

router.route("/").get(getRoles).post(validateSchema(roleSchema), createRole);
router.route("/:id").get(getRole).patch(updateRole).delete(deleteRole);

module.exports = router;
