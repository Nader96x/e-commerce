/* eslint-disable node/no-unsupported-features/es-syntax */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const EmployeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee must have a name."],
      minLength: [3, "Emplyee's name can't be less than 3 characters"],
      maxLength: [50, "Emplyee's name can't be more than 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Employee must have an email."],
      unique: [true, "Employee's email must be unique."],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          // Regular expression to check if the email is valid
          const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
          return emailRegex.test(value);
        },
        message: "Email must be valid",
      },
    },
    phone: {
      type: String,
      required: [true, "Employee must have a phone number."],
      minLength: [
        10,
        "Employee's phone number can't be less than 10 characters",
      ],
      maxLength: [
        12,
        "Employee's phone number can't be more than 10 characters",
      ],
      unique: [true, "Employee's phone number must be unique."],
    },
    password: {
      type: String,
      required: [true, "Employee must have a password."],
      minLength: [8, "Employee's password can't be less than 8 characters."],
      // maxLength: [32, "Employee's password can't be more than 32 characters."],
      // select: false,
    },
    role_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Role",
      validate: {
        validator: async function (value) {
          const role = await mongoose.model("Role").findById(value);
          return role;
        },
        message: "Role doesn't exist.",
      },
      required: [true, "Employee must have a role."],
    },
    is_banned: {
      type: Boolean,
      default: false,
    },
    password_changed_at: {
      type: Date,
      default: null,
      // select: false,
    },
    password_reset_token: {
      type: String,
      default: null,
      // select: false,
    },
    password_reset_token_expires_at: {
      type: Date,
      default: null,
      // select: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual Properties
EmployeeSchema.virtual("role").get(function () {
  return this.role_id.name;
});

// Query Middleware
EmployeeSchema.pre(/^find/, function (next) {
  this.populate("role_id");
  next();
});

EmployeeSchema.pre("save", async function (next) {
  console.log(
    "pre save",
    this.password,
    this.isModified("password"),
    this.isNew
  );
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
    this.password_changed_at = Date.now() - 1000;
    console.log(this.password_changed_at);
  }
  next();
});

// Methods
EmployeeSchema.methods = {
  toJSON() {
    return {
      id: this._id.toHexString(),
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      is_banned: this.is_banned,
      createdAt: this.createdAt,
      last_password_changed_at: this.password_changed_at,
      // updatedAt: this.updatedAt,
      // role_id: this.role_id._id,
    };
  },
  async ban() {
    this.is_banned = true;
    await this.save();
  },
  async unban() {
    this.is_banned = false;
    await this.save();
  },
  async checkPassword(password) {
    // console.log(password, this.password);
    return await bcrypt.compare(password, this.password);
  },
  async createResetPasswordToken() {
    // console.log("createResetPasswordToken");
    // console.log(this);
    this.password_reset_token = crypto.randomBytes(32).toString("hex");
    this.password_reset_token_expires_at = Date.now() + 30 * 60 * 1000;
    await this.save();
    return this.password_reset_token;
  },
  checkResetToken(token) {
    return (
      token === this.password_reset_token &&
      Date.now() < this.password_reset_token_expires_at
    );
  },
  async changePassword(password) {
    // this.password = await bcrypt.hash(password, 10);
    this.password = password;
    // this.password_changed_at = Date.now() - 1000;
    this.password_reset_token = null;
    this.password_reset_token_expires_at = null;
    await this.save({ ValidateBeforeSave: true });
  },
  async generateToken() {
    return await jwt.sign(
      { id: this._id.toHexString(), role: this.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  },
  passwordChangedAfter(JWTTimestamp) {
    if (this.password_changed_at) {
      const changedTimestamp = parseInt(
        this.password_changed_at.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  },
};

// Export Model
// Statics

EmployeeSchema.statics = {
  async findByEmail(email) {
    return this.findOne({ email });
  },
};
module.exports = mongoose.model("Employee", EmployeeSchema);
