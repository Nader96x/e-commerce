const Joi = require("joi");
const AsyncHandler = require("express-async-handler");
const ApiError = require("./ApiError");

function validateSchema(schema, property = `body`) {
  return AsyncHandler((req, res, next) => {
    const { error, value } = schema.validate(
      { ...req[property] },
      {
        abortEarly: false,
        // allowUnknown: true,
      }
    );
    if (process.env.NODE_ENV === "development") console.log(error, value);
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.context.key] = detail.message;
      });
      // const errorMessages = error.details.map((detail) => detail.message);
      // console.log(errorMessages);
      // console.log(errors);
      if (process.env.NODE_ENV === "development") console.log(errors);
      // return next(new ApiError(errors, 422));
      return res.status(422).json({ status: "fail", error: errors });
    }
    next();
  });
}

module.exports = { validateSchema };

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

const customJoi = Joi.defaults((schema) =>
  schema.options({
    messages: JoiMessages,
  })
);
customJoi.objectId = () => Joi.string().hex().length(24);
module.exports = customJoi;
module.exports.validateSchema = validateSchema;
