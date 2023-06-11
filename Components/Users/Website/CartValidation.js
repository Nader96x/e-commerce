const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");

const cart = customJoi.object({
  product_id: customJoi.objectId().required(),
  quantity: customJoi.number().optional().greater(0).default(1),
});

const updateQuantity = customJoi.object({
  product_id: customJoi.objectId().required(),
  quantity: customJoi.number().required().greater(0),
});

module.exports.validateProductToCart = validateSchema(cart);
module.exports.validateUpdateQuantity = validateSchema(updateQuantity);
