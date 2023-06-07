const Joi = require("joi");
const AsyncHandler = require("express-async-handler");
const ApiError = require("./ApiError");

function validateSchema(schema) {
  return AsyncHandler((req, res, next) => {
    const { error, value } = schema.validate(
      { ...req.body, ...req.params },
      {
        abortEarly: false,
        // allowUnknown: true,
      }
    );
    req.body = value;
    if (error) {
      const errors = { errors: error.details.map((err) => err.message) };
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === "development") console.log(errors);
      return next(new ApiError(errors), 422);
    }
    next();
  });
}

module.exports = { validateSchema };
// change Joi Default error message globaly

//{#label}
const JoiMessages = {
  "string.base": `should be a type of 'text'`,
  "string.hex": `should be a type of mongodb 'ObjectId'`,
  "boolean.base": `should be a type of 'boolean'`,
  "date.base": `should be a type of 'date'`,
  "binary.base": `should be a type of 'binary'`,
  "number.base": `should be a type of 'number'`,
  "object.base": `should be a type of 'object'`,
  "any.empty": `cannot be an empty field`,
  "any.min": `should have a minimum length of {#limit}`,
  "any.max": `should have a maximum length of {#limit}`,
  "any.email": `should be a valid email`,
  "any.required": `is a required field`,
  "any.unique": `must be unique`,
  "any.ref": `does not match`,
  "any.only": `does not match`,
};
const mongoID = Joi.string().hex().length(24);
const customJoi = Joi.defaults((schema) => {
  //assign mongoID to all joi.string().hex().length(24)
  // schema.mongoID = () => mongoID;
  return schema.options({
    messages: JoiMessages,
  });
});
customJoi.objectId = () => mongoID;
module.exports = customJoi;
module.exports.validateSchema = validateSchema;
