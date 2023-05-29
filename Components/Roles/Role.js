const mongoose = require("mongoose");
mongoose.Schema(
  {
    name: {
      type: "string",
      trim: true,
      required: [true, " role name  is required"],
    },
    slug: {
      type: "string",
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);
