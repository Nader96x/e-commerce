const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");

const orderId = customJoi.object({
  id: customJoi.objectId().required(),
});

const addressId = customJoi.object({
  address_id: customJoi.objectId().required(),
});

module.exports.validateOrderId = validateSchema(orderId, "params");
module.exports.validateAddressId = validateSchema(addressId);
