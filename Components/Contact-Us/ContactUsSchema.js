const mongoose = require("mongoose");
const { boolean } = require("joi");

const ContactUsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "يجب ادخال الاسم"],
      min: [3, "يجب ان يكون الاسم اكثر من 3 احرف"],
    },
    email: {
      type: String,
      required: [true, "يجب ادخال البريد الالكتروني"],
      min: [3, "يجب ان يكون البريد الالكتروني اكثر من 3 احرف"],
    },
    comment: {
      type: String,
      required: [true, "يجب ادخال التعليق"],
      min: [30, "يجب ان يكون التعليق اكثر من 30 احرف"],
    },
    status: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true, skipVersioning: true }
);

module.exports = mongoose.model("ContactUs", ContactUsSchema);
