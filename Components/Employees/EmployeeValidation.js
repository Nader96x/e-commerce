const customJoi = require("../../Utils/Validation");
const { validateSchema } = require("../../Utils/Validation");
// console.log(customJoi.objectId());
const Login = customJoi.object({
  email: customJoi.string().trim().email().required(),
  password: customJoi.string().required(),
});

const ResetPasswordToken = customJoi.object({
  email: customJoi.string().email().required(),
});

const ResetPassword = customJoi.object({
  password: customJoi.string().required().min(8),
  passwordConfirm: customJoi
    .string()
    .min(8)
    .required()
    .valid(customJoi.ref("password")),
});

const CreateEmployee = customJoi.object({
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

const UpdateEmployee = customJoi.object({
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

const UpdatePassword = customJoi.object({
  password: customJoi.string().required().min(8),
  passwordConfirm: customJoi
    .string()
    .required()
    .min(8)
    .valid(customJoi.ref("password")),
});

const getEmployeeById = customJoi.object({
  id: customJoi.objectId().required(),
});

const getAllEmployees = customJoi.object({
  page: customJoi.number().min(1).default(1),
  limit: customJoi.number().min(1).default(10),
});

module.exports.validateLogin = validateSchema(Login);
module.exports.validateResetPasswordToken = validateSchema(ResetPasswordToken);
module.exports.validateResetPassword = validateSchema(ResetPassword);
module.exports.validateCreateEmployee = validateSchema(CreateEmployee);
module.exports.validateUpdateEmployee = validateSchema(UpdateEmployee);
module.exports.validateUpdatePassword = validateSchema(UpdatePassword);
module.exports.validateGetEmployeeById = validateSchema(getEmployeeById);
module.exports.validateGetAllEmployees = validateSchema(getAllEmployees);
