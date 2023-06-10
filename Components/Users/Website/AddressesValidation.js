const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");

const getAddressId = customJoi.object({
  id: customJoi.objectId().required(),
});

const addAddress = customJoi.object({
  area: customJoi.string().required(),
  city: customJoi.string().required(),
  governorate: customJoi.string().required(),
  country: customJoi.string().required(),
});

const updateAddress = customJoi.object({
  id: customJoi.objectId().required(),
  area: customJoi.string().optional(),
  city: customJoi.string().optional(),
  governorate: customJoi.string().optional(),
  country: customJoi.string().optional(),
});

module.exports.validateAddressId = validateSchema(getAddressId);
module.exports.validateAddAddress = validateSchema(addAddress);
module.exports.validateUpdateAddress = validateSchema(updateAddress);
