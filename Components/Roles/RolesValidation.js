const Joi = require("../../Utils/Validation");
const RoleModel = require("./Role");

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
  }),
});

const roleSchema = Joi.object({
  name: Joi.string().trim().required(),
  permissions: Joi.array().items(permissionSchema).required().messages({
    "any.required": "Permissions are required",
  }),
}).options({ abortEarly: false });

module.exports = roleSchema;
