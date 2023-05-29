const RoleModel = require("./Role")
const Factory = require("../../Utils/Factory")

/*
 * @description get all roles in the system for admin
 * @route GET /api/v1/roles
 * @access private[admin]
 */

module.exports.getRoles = Factory.getAll(RoleModel)

/*
 * @description get specific role by RoleID
 * @route GET /api/v1/roles/:id
 * @access private[ admin ]
 */
module.exports.getRole = Factory.getOne(RoleModel)
/*
 * @description auth user Create new Role
 * @route POST /api/v1/roles
 * @access private[admin]
 */
module.exports.createRole = Factory.createOne(RoleModel)

/*
 * @description update specific Role by RoleID / admin can edit Role status  only
 * @route PATCH /api/v1/roles/:id
 * @access private[admin ]
 */

module.exports.updateRole = Factory.updateOne(RoleModel)

/*
 * @description delete specific Role by RoleID
 * @route DELETE /api/v1/roles/:id
 * @access private[admin]
 */
module.exports.deleteRole = Factory.deleteOne(RoleModel)