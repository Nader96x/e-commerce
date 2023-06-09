const mongoose = require("mongoose");
const ApiError = require("../../Utils/ApiError");

const Permission = mongoose.Schema({
  _id: false,
  entity: {
    type: String,
    enum: [
      "categories",
      "products",
      "users",
      "roles",
      "employees",
      "orders",
      "settings",
    ],
  },
  access: {
    get: Boolean,
    post: Boolean,
    patch: Boolean,
    delete: Boolean,
    ban: Boolean,
    unban: Boolean,
    activate: Boolean,
    deactivate: Boolean,
  },
});
const RoleSchema = mongoose.Schema(
  {
    name: {
      type: "string",
      trim: true,
      required: [true, "role name is required"],
      minLength: [3, "role name can't be less than 3 characters"],
      maxLength: [50, "role name can't be more than 50 characters"],
      unique: true,
    },
    permissions: {
      type: [Permission],
      required: [true, "permissions  are required"],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

RoleSchema.pre("findOneAndUpdate", async function (next) {
  const updatedRole = await this.model.findOne(this.getQuery());
  if (updatedRole.name === "super-admin") {
    return next(new ApiError("Super Admin Role Status Cannot be changed", 400));
  }
  next();
});

const RoleModel = mongoose.model("Role", RoleSchema);
module.exports = RoleModel;
