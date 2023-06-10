const customJoi = require("../../../Utils/Validation");
const { validateSchema } = require("../../../Utils/Validation");

const updateProfile = customJoi.object({
  name: customJoi.string().optional(),
  email: customJoi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org"] },
    })
    .optional(),
  phone: customJoi
    .string()
    .optional()
    .pattern(/^01[0125][0-9]{8}$/),
  image: customJoi.string().optional(),
  bio: customJoi.string().optional(),
});

const register = customJoi.object({
  name: customJoi.string().required(),
  email: customJoi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org"] },
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

const login = customJoi.object({
  email: customJoi.string().required().email(),
  password: customJoi.string().required().min(8),
});

const forgotPassword = customJoi.object({
  email: customJoi.string().required().email(),
});

const resetPassword = customJoi.object({
  token: customJoi
    .string()
    .length(64)
    .pattern(/^[a-f0-9]+$/)
    .required(),
  password: customJoi.string().required().min(8),
  confirmPassword: customJoi.ref("password"),
});

const updatePassword = customJoi.object({
  currentPassword: customJoi.string().required().min(8),
  password: customJoi.string().required().min(8),
  confirmPassword: customJoi.ref("password"),
});

module.exports.validateUpdateProfile = validateSchema(updateProfile);
module.exports.validateRegister = validateSchema(register);
module.exports.validateLogin = validateSchema(login);
module.exports.validateForgotPassword = validateSchema(forgotPassword);
module.exports.validateResetPassword = validateSchema(resetPassword);
module.exports.validateUpdatePassword = validateSchema(updatePassword);
