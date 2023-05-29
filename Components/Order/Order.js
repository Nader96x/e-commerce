const mongoose = require("mongoose");

const product = mongoose.Schema({
  _id: {
    type: mongoose.Types.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, " product id is required"],
  },
  quantity: {
    type: Number,
    require: [true, "quantity  is requires"],
    min: [1, " minimum quantity should be  1 "],
  },
  price: {
    Type: Number,
    min: [1, " invaild price should be positive number"],
    require: [true, "price  is requires"],
  },
});

const address = mongoose.Schema({
  area: {
    type: String,
    require: [true, "area is requires"],
  },
  city: { type: String, require: [true, "city is requires"] },
  governorate: { type: String, require: [true, "governorate is requires"] },
  country: { type: String, require: [true, "country is requires"] },
});

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true, "user requires"],
    },
    products: [product],
    total_price: {
      type: Number,
      require: [true, "total price is requires"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Complete", "Cancelled"],
      default: "Pending",
    },
    status_history: {
      status: {
        type: String,
        enum: ["Pending", "Processing", "Complete", "Cancelled"],
      },
      date: {
        type: Date,
        require: [true, "status update date = is requires"],
      },
      address: address,
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    payment_method: String,
    payment_id: Number,
  },
  { timestamps: true }
);
const OrderModel = mongoose.Model("Order", OrderSchema);
module.exports = OrderModel;
