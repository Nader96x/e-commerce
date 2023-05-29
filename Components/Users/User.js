const mongoose = require("mongoose");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const AddressSchema = new mongoose.Schema({
  area: {
    type: String,
    required: [true, "Please Enter Your Area"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "Please Enter Your City"],
    trim: true,
  },
  governorate: {
    type: String,
    required: [true, "Please Enter Your Governorate"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Please Enter Your Country"],
    trim: true,
  },
}); // Schema For the Full Address

const cartProductsSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
    required: [true, "Product ID is Required"],
  },
  quantity: {
    type: Number,
    required: [true, "Product Quantity is required"],
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is Required"],
      validate: {
        validator: function (value) {
          const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{5,50}$/;
          return usernameRegex.test(value);
        },
        message: "User name is Invalid",
      },
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Regular expression to check if the name is written in English
          const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid email",
      },
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
      required: [true, "Please Enter Your Password"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is Required"],
      unique: [true, "This phone Already Exists"],
      validate: {
        validator: function (value) {
          const egyptianRegex = /^01[0125][0-9]{8}$/;
          return egyptianRegex.test(value);
        },
        message: "Please enter Valid phone number",
      },
    },
    image: {
      type: String,
      required: [true, "User Image is Required"],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, "Bio is Required"],
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    address: [
      {
        type: AddressSchema,
        required: [true, "User Must Have an Address"],
      },
    ],
    cart: [
      {
        type: cartProductsSchema,
        required: false,
      },
    ],
    reset_password_token: {
      type: String,
      default: null,
    },
    reset_password_token_expire: {
      type: Date,
      default: null,
    },
    email_token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
  next();
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
const Address = mongoose.model("Address", AddressSchema);

module.exports = { User, Address };
