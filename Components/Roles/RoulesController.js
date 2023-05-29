const RoleModel = require("./Role")
const Factory = require("../../Utils/Factory")

/*
 * @description get all roles in the system for admin
 * @route GET /api/v1/roles
 * @access private[admin]
 */

module.exports.getOrders = Factory.getAll(RoleModel)

/*
 * @description get specific role by orderID
 * @route GET /api/v1/roles/:id
 * @access private[ user - admin ]
 */
module.exports.getOrder = Factory.getOne(RoleModel)
/*
 * @description auth user Create new order
 * @route POST /api/v1/roles
 * @access private[user]
 */
module.exports.createOrder = Factory.createOne(RoleModel)

/*
 * @description update specific order by orderID / admin can edit order status  only
 * @route PATCH /api/v1/roles/:id
 * @access private[user - admin ]
 */

module.exports.updateOrder = Factory.updateOne(RoleModel)

/*
 * @description delete specific order by orderID
 * @route DELETE /api/v1/roles/:id
 * @access private[user]
 */
module.exports.deleteOrder = Factory.deleteOne(RoleModel)