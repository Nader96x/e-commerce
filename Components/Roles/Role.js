const mongoose = require("mongoose");

const Permission = mongoose.Schema({
  entity: {
    type: String,
    enum: ["category", "product", "user", "role", "employee", "order"],
  },
  access: {
    canRead: Boolean,
    canWrite: Boolean,
    canUpdate: Boolean,
    canDelete: Boolean,
    canBan: Boolean,
    canUnban: Boolean,
  },
});
const RoleSchema = mongoose.Schema(
  {
    name: {
      type: "string",
      trim: true,
      required: [true, "role name is required"],
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
