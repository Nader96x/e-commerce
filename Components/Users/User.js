const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const AddressSchema = new mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId, auto: true },
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
  _id: false,
  product_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
    required: [true, "Product ID is Required"],
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: { type: Number, required: [true, "Price is required"] },
  name_en: { type: String, required: [true, "Name is required"] },
  image: {
    type: String,
    required: [true, "image is Missing"],
  },
}); // Schema For the Cart

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is Required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: [true, "This email Already Exists"],
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
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please Enter Your Confirm Password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords are not the Same",
      },
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
    address: {
      type: [AddressSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "User must have at least One Address",
      },
    },
    cart: {
      type: [cartProductsSchema],
      populate: { path: "product_id" },
    },
    reset_password_token: {
      type: String,
      default: undefined,
    },
    reset_password_token_expire: {
      type: Date,
      default: undefined,
    },
    email_token: {
      type: String,
      default: undefined,
    },
    verified_at: {
      type: Date,
      default: undefined,
    },
    passwordChangedAt: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("update", function (next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
}); // crypt the password

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
}); // update Changed At password after reset success

userSchema.methods = {
  toJSON() {
    return {
      _id: this._id.toHexString(),
      name: this.name,
      email: this.email,
      phone: this.phone,
      image: this.image,
      bio: this.bio,
      is_active: this.is_active,
      address: this.address,
      cart: this.cart,
      password: this.password,
      verified_at: this.verified_at,
      reset_password_token: this.reset_password_token,
      reset_password_token_expire: this.reset_password_token_expire,
      email_token: this.email_token,
      passwordChangedAt: this.passwordChangedAt,
      id: this._id.toHexString(),
    };
  },
  checkPassword(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
  }, // compare passwords
  changedPasswordAfter(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
  }, // check last date user changed his password
  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.reset_password_token = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.reset_password_token_expire = Date.now() + 30 * 60 * 1000;
    return resetToken;
  },
  createEmailVerificationToken() {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    this.email_token = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    return verificationToken;
  },
};

userSchema.statics = {
  async countUsers() {
    return await this.countDocuments();
  },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
