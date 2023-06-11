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
      unique: [true, "Employee's email must be unique."],
      required: [true, "Employee must have an email."],
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
      validate: {
        validator: function (value) {
          const egyptianRegex = /^01[0125][0-9]{8}$/;
          return egyptianRegex.test(value);
        },
        message: "Please enter Valid phone number",
      },
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    skipVersioning: { dontVersionMe: true },
  }
);

// Virtual Properties
EmployeeSchema.virtual("role").get(function () {
  // console.log("virtual role", this.role_id.name);
  // console.log("virtual role", this.role_id.permissions);
  return this.role_id.name;
});
EmployeeSchema.virtual("permissions").get(function () {
  return this.role_id.permissions;
});

// Query Middleware
EmployeeSchema.pre(/^find/, function (next) {
  this.populate("role_id");
  next();
});

// Document Middleware
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

EmployeeSchema.post("save", (err, doc, next) => {
  // console.log("post save", err);
  if (err.name === "MongoError" && err.code === 11000) {
    next(new Error("Email already exists"));
  } else {
    next(err);
  }
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
      permissions: this.permissions,
      is_banned: this.is_banned,
      createdAt: this.createdAt,
      last_password_changed_at: this.password_changed_at,
      // updatedAt: this.updatedAt,
      // role_id: this.role_id._id,
    };
  },
  async isAuthorized(method, routes) {
    // console.log("isAuthorized");
    // console.log(method, routes);
    // console.log(this.role_id);
    if (!this.role_id || routes.length < 3) return false;
    const entityObj = this.role_id.permissions.find(
      (perm) =>
        // console.log(perm.entity, routes[2]);
        perm.entity == routes[2]
    );
    // console.log(entityObj);
    if (!entityObj || !entityObj.access) return false;
    if (
      routes.length == 5 &&
      method == "POST" &&
      (routes[4] == "ban" || routes[4] == "ban")
    ) {
      // console.log("ban");
      if (
        (routes[4] == "ban" && entityObj.access.ban) ||
        routes[4] == "unban" ||
        entityObj.access.unban
      )
        return true;
    } else if (entityObj.access.all || entityObj.access[method.toLowerCase()]) {
      return true;
    }
    return false;
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
