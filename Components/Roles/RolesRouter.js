const express = require("express");
const { object } = require("joi");
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

const check_minimum_view = (req, res, next) => {
  req.body.permissions = req.body.permissions.map(({ access, entity }) => {
    console.log(access, Object.keys(access));
    if (
      Object.keys(access).length &&
      !Object.keys(access).some((key) => key.toLowerCase() === "get")
    ) {
      access.get = true;
    }
    return {
      access,
      entity,
    };
  });
  // res.json(req.body.permissions);
  next();
};

const router = express.Router();

router
  .route("/")
  .get(getRoles)
  .post(validateSchema(roleSchema), check_minimum_view, createRole);
router.route("/:id").get(getRole).patch(updateRole).delete(deleteRole);
router.route("/:id/unban").post(activateRole);
router.route("/:id/ban").post(deactivateRole);

module.exports = router;
