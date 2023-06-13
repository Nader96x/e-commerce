const mongoose = require("mongoose");
const slugify = require("slugify");
const ApiError = require("../../Utils/ApiError");

const productSchema = mongoose.Schema(
  {
    name_en: {
      type: String,
      required: [true, "Product English Name is Required"],
      unique: [true, "Product Name Already Exists"],
      validate: {
        validator: function (value) {
          // Regular expression to check if the name is written in English
          const englishRegex = /^[a-zA-Z\s]+$/;
          return englishRegex.test(value);
        },
        message: "Product Name must be written in English",
      },
      minLength: [5, "Product Name cannot be less than 5 characters"],
      maxLength: [50, "Product Name cannot be more than 50 characters"],
      trim: true,
    },
    name_ar: {
      type: String,
      required: [true, "Product Arabic Name is Required"],
      unique: [true, "Product Name Already Exists"],
      validate: {
        validator: function (value) {
          // Regular expression to check if the name is written in Arabic
          const arabicRegex = /^[\u0600-\u06ff\s]+$/;
          return arabicRegex.test(value);
        },
        message: "Product Name must be written in Arabic",
      },
      minLength: [5, "Product Name cannot be less than 5 characters"],
      maxLength: [50, "Product Name cannot be more than 50 characters"],
      trim: true,
    },
    desc_en: {
      type: String,
      required: [true, "Product English Description is Required"],
      minLength: [10, "Product Description cannot be less than 10 characters"],
      maxLength: [
        200,
        "Product Description cannot be more than 200 characters",
      ],
      validate: {
        validator: function (value) {
          // Regular expression to check if the name is written in English
          const englishRegex = /^[a-zA-Z\s]+$/;
          return englishRegex.test(value);
        },
        message: "Product English Description must be written in English",
      },
      trim: true,
    },
    desc_ar: {
      type: String,
      required: [true, "Product English Description is Required"],
      minLength: [20, "Product Description cannot be less than 20 characters"],
      maxLength: [
        200,
        "Product Description cannot be more than 200 characters",
      ],
      validate: {
        validator: function (value) {
          // Regular expression to check if the name is written in Arabic
          const arabicRegex = /^[\u0600-\u06ff\s]+$/;
          return arabicRegex.test(value);
        },
        message: "Product Arabic Description must be written in Arabic",
      },
      trim: true,
    },
    price: {
      type: mongoose.SchemaTypes.Decimal128,
      required: [true, "Product Price is Required"],
    },
    image: {
      type: String,
      required: [true, "Product Image is Required"],
      trim: true,
    },
    images: [
      {
        type: String,
        required: [true, "Images of product is required"],
        trim: true,
      },
    ],
    quantity: {
      type: Number,
      required: [true, "Product Quantity is Required"],
      trim: true,
      min: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    total_orders: {
      type: Number,
      default: 0,
    },
    category_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: [true, "Product Must have Category"],
    },
    slug: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    skipVersioning: { dontVersionMe: true },
  }
);

productSchema.pre(/^find/, function (next) {
  this.populate("category_id");
  next();
});

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name_en, {
    lower: true,
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
  next();
});

productSchema.pre("save", async function (next) {
  const id = this.category_id;
  const category = await this.getCategoryById(id);
  if (!category) {
    return next(new ApiError(`No Category was Found for this ID ${id}`, 404));
  }
  next();
});

productSchema.pre("findOneAndDelete", async function (next) {
  const product = await this.model.findOne(this.getFilter());
  if (product && product.total_orders > 0) {
    return next(new ApiError("Product Cannot Be Deleted", 400));
  }
  next();
});

productSchema.pre("update", function (next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.methods.getCategoryById = function (id) {
  // eslint-disable-next-line global-require
  const Category = require("../Categories/Category");
  return Category.findById(id);
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
