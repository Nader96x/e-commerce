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
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.virtual("name").get(function () {
  return { en: this.name_en, ar: this.name_ar };
});

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

categorySchema.post("save", function () {
  this.slug = slugify(this.name_en, {
    lower: true,
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
});

categorySchema.pre("findOneAndDelete", async function (next) {
  const Product = require("../Products/Product");
  const filter = this.getFilter();
  const products = await Product.find({ category_id: filter._id });
  if (products.length > 0) {
    return next(
      new ApiError(
        `Category Has ${products.length} Products, Cannot be deleted`,
        400
      )
    );
  }
  next();
});

categorySchema.methods = {
  toJSON() {
    return {
      _id: this._id.toHexString(),
      name_ar: this.name_ar,
      name_en: this.name_en,
      image: this.image,
      slug: this.slug,
      is_active: this.is_active,
      id: this._id.toHexString(),
    };
  },
};
categorySchema.statics = {
  async countCategories() {
    return await this.countDocuments();
  },
};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
