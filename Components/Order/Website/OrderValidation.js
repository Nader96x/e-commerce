const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");

const orderId = customJoi.object({
  id: customJoi.objectId().required(),
});

const checkout = customJoi.object({
  address_id: customJoi.objectId().required(),
  payment_method: customJoi.string().valid("Cash", "Credit Card").optional(),
});

module.exports.validateOrderId = validateSchema(orderId, "params");
module.exports.validateCheckout = validateSchema(checkout);
