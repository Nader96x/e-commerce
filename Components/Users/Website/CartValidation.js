const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");
const Product = require("../../Products/Product");

const cart = customJoi.object({
  product_id: customJoi.objectId().required(),
  quantity: customJoi.number().optional().min(1).default(1),
});

module.exports.validateProductToCart = validateSchema(cart);
