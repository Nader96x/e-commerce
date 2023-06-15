const customJoi = require("../../Utils/Validation");
const { validateSchema } = require("../../Utils/Validation");

const productId = customJoi.object({
  id: customJoi.objectId().required(),
});

const createProduct = customJoi.object({
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
  desc_ar: customJoi
    .string()
    .required()
    .min(10)
    .max(200)
    .regex(/^[\u0600-\u06ff\s]+$/),
  desc_en: customJoi
    .string()
    .required()
    .min(10)
    .max(200)
    .regex(/^[a-zA-Z\s]+$/),
  price: customJoi.number().required(),
  image: customJoi.string().required(),
  images: customJoi.array().items(customJoi.string().required()).required(),
  quantity: customJoi.number().required().greater(-1),
  category_id: customJoi.objectId().required(),
  // total_orders: customJoi.number().optional(),
});

const updateProduct = customJoi.object({
  name_ar: customJoi
    .string()
    .optional()
    .min(3)
    .max(50)
    .regex(/^[\u0600-\u06ff\s]+$/),
  name_en: customJoi
    .string()
    .optional()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z\s]+$/),
  desc_ar: customJoi
    .string()
    .optional()
    .min(10)
    .max(200)
    .regex(/^[\u0600-\u06ff\s]+$/),
  desc_en: customJoi
    .string()
    .optional()
    .min(10)
    .max(200)
    .regex(/^[a-zA-Z\s]+$/),
  price: customJoi.number().optional(),
  image: customJoi.string().optional(),
  images: customJoi.array().items(customJoi.string().optional()).optional(),
  quantity: customJoi.number().optional().greater(-1),
  is_active: customJoi.boolean().optional(),
  category_id: customJoi.objectId().optional(),
  // total_orders: customJoi.number().optional(),
});

module.exports.validateProductId = validateSchema(productId, "params");
module.exports.validateCreateProduct = validateSchema(createProduct);
module.exports.validateUpdateProduct = validateSchema(updateProduct);
