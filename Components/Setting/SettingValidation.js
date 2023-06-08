const customJoi = require("../../Utils/Validation");
const { validateSchema } = require("../../Utils/Validation");

const Banner = customJoi.object({
  image: customJoi.string().required(),
  link: customJoi.string().required(),
  alt: customJoi.string(),
});

const Address = customJoi.object({
  street: customJoi.string(),
  city: customJoi.string(),
  state: customJoi.string(),
  country: customJoi.string(),
});

const SocialMedia = customJoi.object({
  url: customJoi.string().required(),
  name: customJoi.string().required(),
});

const setting = customJoi.object({
  logo: customJoi.string(),
  email: customJoi.string(),
  locations: customJoi.array().items(customJoi.string()),
  phone: customJoi.string().regex(/^01[0125][0-9]{8}$/),
  terms_and_conditions: customJoi.string(),
  about_us: customJoi.string(),
  contact_us: customJoi.string(),
  social_media: customJoi.array().items(SocialMedia),
  banners: customJoi.array().items(Banner),
});

module.exports.validateSetting = validateSchema(setting);
