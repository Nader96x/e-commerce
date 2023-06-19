const AsyncHandler = require("express-async-handler");
const Joi = require("../../Utils/Validation");
const RoleModel = require("./Role");
const ApiError = require("../../Utils/ApiError");

async function isUnique(value) {
  const existingRole = await RoleModel.findOne({ name: value });
  return !existingRole;
}

const permissionSchema = Joi.object({
  entity: Joi.string().valid(
    "categories",
    "products",
    "users",
    "roles",
    "employees",
    "orders"
  ),
  access: Joi.object({
    get: Joi.boolean(),
    post: Joi.boolean(),
    patch: Joi.boolean(),
    delete: Joi.boolean(),
    ban: Joi.boolean(),
    unban: Joi.boolean(),
  }),
});

const validateUniqueRoleName = AsyncHandler(async (value, helpers) => {
  console.log(value);
  const existingRole = await RoleModel.findOne({ name: value });
  console.log(existingRole);

  if (existingRole) return helpers.error("any.unique");
});

const roleSchema = Joi.object({
  name: Joi.string().trim().required(),
  permissions: Joi.array().items(permissionSchema).required().messages({
    "any.required": "Permissions are required",
  }),
}).options({ abortEarly: false });

module.exports = roleSchema;
