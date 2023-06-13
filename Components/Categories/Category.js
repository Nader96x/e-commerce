const mongoose = require("mongoose");
const slugify = require("slugify");
const ApiError = require("../../Utils/ApiError");

const categorySchema = mongoose.Schema(
  {
    name_ar: {
      type: String,
      required: [true, "Category arabic Name is Required"],
      unique: [true, "Category name Already Exists"],
      minLength: [3, "Category name cannot be less than 3 characters"],
      maxLength: [50, "Category name must be less than 50 characters"],
      validate: {
        validator: function (value) {
          // Regular expression to check if the name is written in Arabic
          const arabicRegex = /^[\u0600-\u06ff\s]+$/;
          return arabicRegex.test(value);
        },
        message: "Name must be written in Arabic",
      },
      trim: true,
    },
    name_en: {
      type: String,
      required: [true, "Category Name in  is Required"],
      unique: [true, "Category name Already Exists"],
      minLength: [3, "Category name cannot be less than 3 characters"],
      maxLength: [50, "Category name must be less than 50 characters"],
      validate: {
        validator: function (value) {
          // Regular expression to check if the name is written in English
          const englishRegex = /^[a-zA-Z\s]+$/;
          return englishRegex.test(value);
        },
        message: "Name must be written in English",
      },
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category Image is Required"],
      trim: true,
    },
    slug: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Document MiddleWare: runs before save(), create()
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name_en, {
    lower: true,
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
  next();
});

categorySchema.pre("findByIdAndUpdate", async function (next) {
  this.slug = await slugify(this.name_en, {
    lower: true,
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
  this.updatedAt = Date.now();
  next();
});

categorySchema.pre("remove", async function (next) {
  const products = await this.getProductByCategoryId(this._id);
  if (products.length > 0 && products.some((product) => product.category_id)) {
    return next(
      new ApiError("Category Cannot Be Deleted, It Has Products", 400)
    );
  }
  next();
});

categorySchema.methods.getProductByCategoryId = function (id) {
  // eslint-disable-next-line global-require
  const Product = require("../Products/Product");
  return Product.find({ category_id: id }).populate("category_id");
};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
