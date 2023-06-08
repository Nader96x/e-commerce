const mongoose = require("mongoose");

const Permission = mongoose.Schema({
  _id: false,
  entity: {
    type: String,
    enum: ["categories", "products", "users", "roles", "employees", "orders"],
  },
  access: {
    get: Boolean,
    post: Boolean,
    patch: Boolean,
    delete: Boolean,
    ban: Boolean,
  },
});
const RoleSchema = mongoose.Schema(
  {
    name: {
      type: "string",
      trim: true,
      required: [true, "role name is required"],
      unique: true,
    },
    permissions: {
      type: [Permission],
      required: [true, "permissions  are required"],
    },
  },
  { timestamps: true }
);
const RoleModel = mongoose.model("Role", RoleSchema);
module.exports = RoleModel;
