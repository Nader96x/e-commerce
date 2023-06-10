const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");

const cart = customJoi.object({
  product_id: customJoi.objectId().required(),
  quantity: customJoi.number().optional(),
});

module.exports.validateProductToCart = validateSchema(cart);
