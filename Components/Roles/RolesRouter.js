const express = require("express");
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  activateRole,
  deactivateRole,
} = require("./RoulesController");
const roleSchema = require("./RolesValidation");
const { validateSchema } = require("../../Utils/Validation");

const router = express.Router();

router.route("/").get(getRoles).post(validateSchema(roleSchema), createRole);
router.route("/:id").get(getRole).patch(updateRole).delete(deleteRole);
router.route("/:id/unban").post(activateRole);
router.route("/:id/ban").post(deactivateRole);

module.exports = router;
