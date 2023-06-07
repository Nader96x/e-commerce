const customJoi = require("../../Utils/Validation");
const { validateSchema } = require("../../Utils/Validation");
// console.log(customJoi.objectId());
module.exports.Login = customJoi.object({
  email: customJoi.string().trim().email().required(),
  password: customJoi.string().required(),
});

module.exports.ResetPasswordToken = customJoi.object({
  email: customJoi.string().email().required(),
});

module.exports.ResetPassword = customJoi.object({
  password: customJoi.string().required().min(8),
  passwordConfirm: customJoi
    .string()
    .min(8)
    .required()
    .valid(customJoi.ref("password")),
});

module.exports.CreateEmployee = customJoi.object({
  name: customJoi.string().required(),
  email: customJoi.string().email().required(),
  password: customJoi.string().required().min(8),
  passwordConfirm: customJoi
    .string()
    .min(8)
    .required()
    .valid(customJoi.ref("password")),
  // role: customJoi.objectId().required(),
  phone: customJoi.string().required(),
  address: customJoi.string().required(),
  salary: customJoi.number().required(),
  image: customJoi.string().required(),
});

module.exports.UpdateEmployee = customJoi.object({
  name: customJoi.string(),
  email: customJoi.string().email(),
  password: customJoi.string().min(8),
  passwordConfirm: customJoi.string().min(8).valid(customJoi.ref("password")),
  // role: customJoi.objectId().required(),
  phone: customJoi.string(),
  address: customJoi.string(),
  salary: customJoi.number(),
  image: customJoi.string(),
});

module.exports.UpdatePassword = customJoi.object({
  password: customJoi.string().required().min(8),
  passwordConfirm: customJoi
    .string()
    .required()
    .min(8)
    .valid(customJoi.ref("password")),
});

module.exports.getEmployeeById =
  module.exports.deleteEmployee =
  module.exports.ban =
    customJoi.object({
      id: customJoi.objectId().required(),
    });

module.exports.getAllEmployees = customJoi.object({
  page: customJoi.number().min(1).default(1),
  limit: customJoi.number().min(1).default(10),
});

const validate = (schema) => async (req, res, next) => {
  const { error, value } = schema.validate(
    { ...req.body, ...req.params },
    {
      abortEarly: false,
      // allowUnknown: true,
    }
  );

  req.body = value;
  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return res.status(400).json({
      status: "fail",
      errors,
    });
  }
  next();
};

module.exports.validateLogin = validateSchema(module.exports.Login);
module.exports.getEmployeeById = validateSchema(module.exports.getEmployeeById);
