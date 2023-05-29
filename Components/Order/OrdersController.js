const OrderModel = require("./Order")
const Factory = require("../../Utils/Factory")

/*
 * @description get all orders in the system for admin / get all orders for specific user by userID
 * @route GET /api/v1/orders
 * @access private[ user -admin]
 */

module.exports.getOrders = Factory.getAll(OrderModel)

/*
 * @description get specific order by orderID
 * @route GET /api/v1/orders/:id
 * @access private[ user - admin ]
 */
module.exports.getOrder = Factory.getOne(OrderModel)
/*
 * @description auth user Create new order
 * @route POST /api/v1/orders
 * @access private[user]
 */
module.exports.createOrder = Factory.createOne(OrderModel)

/*
 * @description update specific order by orderID / admin can edit order status  only
 * @route PATCH /api/v1/orders/:id
 * @access private[user - admin ]
 */

module.exports.updateOrder = Factory.updateOne(OrderModel)

/*
 * @description delete specific order by orderID
 * @route DELETE /api/v1/orders/:id
 * @access private[user]
 */
module.exports.deleteOrder = Factory.deleteOne(OrderModel)