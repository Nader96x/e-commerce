const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");

const addProduct = customJoi.object({
  product_id: customJoi.objectId().required(),
  quantity: customJoi.number().optional(),
});

module.exports.validateAddProductToCart = validateSchema(addProduct);
