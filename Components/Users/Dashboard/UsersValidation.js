const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");

const userID = customJoi.object({
  id: customJoi.objectId().required(),
});

const getOneAddress = customJoi.object({
  id: customJoi.objectId().required(),
  address: customJoi.objectId().required(),
});

const createUser = customJoi.object({
  name: customJoi.string().required(),
  email: customJoi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "edu", "gov"] },
    })
    .required(),
  password: customJoi.string().required().min(8),
  confirmPassword: customJoi.ref("password"),
  phone: customJoi
    .string()
    .required()
    .pattern(/^01[0125][0-9]{8}$/),
  image: customJoi.string().required(),
  bio: customJoi.string().required(),
  address: customJoi
    .object({
      area: customJoi.string().required().trim(),
      city: customJoi.string().required().trim(),
      governorate: customJoi.string().required().trim(),
      country: customJoi.string().required().trim(),
    })
    .min(1)
    .required(),
});

const updateUser = customJoi.object({
  name: customJoi.string().optional(),
  email: customJoi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "edu", "gov"] },
    })
    .optional(),
  phone: customJoi
    .string()
    .optional()
    .pattern(/^01[0125][0-9]{8}$/),
  image: customJoi.string().optional(),
  bio: customJoi.string().optional(),
});

module.exports.validateUserId = validateSchema(userID, "params");
module.exports.validateGetAddress = validateSchema(getOneAddress, "params");
module.exports.validateCreateUser = validateSchema(createUser);
module.exports.validateUpdateUser = validateSchema(updateUser);
