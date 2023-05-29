const mongoose = require("mongoose");
Permission = mongoose.Schema({
  entity :{
    type :String,
    enum:["category","product","user","role","employee","order"]
  },
  access:{
    canRead:Boolean,
    canWrite:Boolean,
    canUpdate:Boolean,
    canDelete:Boolean
  }
});
const RoleSchema = mongoose.Schema(
  {
    name: {
      type: "string",
      trim: true,
      required: [true, " role name  is required"],
    },
    permissions: {
      type: [Permission],
      required: [true, " permissions  is required"],
    }
  },
  { timestamps: true }
);
const RoleModel = mongoose.model("Role",RoleSchema)
module.exports = RoleModel;
