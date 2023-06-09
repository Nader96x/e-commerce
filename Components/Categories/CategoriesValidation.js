const customJoi = require("../../Utils/Validation");
const { validateSchema } = require("../../Utils/Validation");

const CategoryId = customJoi.object({
  id: customJoi.objectId().required(),
});

const createCategory = customJoi.object({
  name_ar: customJoi
    .string()
    .required()
    .min(3)
    .max(50)
    .regex(/^[\u0600-\u06ff\s]+$/),
  name_en: customJoi
    .string()
    .required()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z\s]+$/),
  image: customJoi.string().required(),
});

const updateCategory = customJoi.object({
  name_ar: customJoi
    .string()
    .min(3)
    .max(50)
    .regex(/^[\u0600-\u06ff\s]+$/)
    .optional(),
  name_en: customJoi
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z\s]+$/)
    .optional(),
  image: customJoi.string().optional(),
});

module.exports.validateCategoryId = validateSchema(CategoryId, "params");
module.exports.validateCreateCategory = validateSchema(createCategory);
module.exports.validateUpdateCategory = validateSchema(updateCategory);
