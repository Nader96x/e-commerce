const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");

const updateProfile = customJoi.object({
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

module.exports.validateUpdateProfile = validateSchema(updateProfile);
