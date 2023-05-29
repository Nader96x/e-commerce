const express = require("express");
const { getRoles,getRole,createRole,updateRole,deleteRole} = require("./RoulesController")
const router = express.Router();

router.route("/")
  .get(getRoles)
  .post(getRole)
router.route("/:id")
  .get(createRole)
  .patch(updateRole)
  .delete(deleteRole)

module.exports = router;