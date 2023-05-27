/* eslint-disable node/no-unsupported-features/es-syntax */
const mongoose = require("mongoose");

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
      format: ["email", "Employee's email must be in email format"],
    },
    phone: {
      type: String,
      required: [true, "Employee must have a phone number."],
      minLength: [
        10,
        "Employee's phone number can't be less than 10 characters",
      ],
      maxLength: [
        10,
        "Employee's phone number can't be more than 10 characters",
      ],
      unique: [true, "Employee's phone number must be unique."],
    },
    password: {
      type: String,
      required: [true, "Employee must have a password."],
      minLength: [8, "Employee's password can't be less than 8 characters."],
      maxLength: [32, "Employee's password can't be more than 32 characters."],
      select: false,
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Employee must have a role."],
    },
    password_reset_token: {
      type: String,
      default: null,
      select: false,
    },
    password_reset_token_expires_at: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual Properties
EmployeeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Methods
EmployeeSchema.methods = {
  toJSON() {
    return {
      id: this._id.toHexString(),
      name: this.name,
      email: this.email,
      phone: this.phone,
      role_id: this.role_id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
};
// Statics
EmployeeSchema.statics = {
  createEmployee(args) {
    return this.create({
      ...args,
    });
  },
  getEmployeeById(id) {
    return this.findById(id).populate("role_id");
  },
  getEmployeeByEmail(email) {
    return this.findOne({ email }).populate("role_id");
  },
  getEmployeeByPhone(phone) {
    return this.findOne({ phone }).populate("role_id");
  },
  getEmployees() {
    return this.find().populate("role_id");
  },
  updateEmployee(id, args) {
    return this.findByIdAndUpdate(id, { $set: args });
  },
  deleteEmployee(id) {
    return this.findByIdAndDelete(id);
  },
};
// Export Model
module.exports = mongoose.model("Employee", EmployeeSchema);
