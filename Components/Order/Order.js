const mongoose = require("mongoose");

const product = mongoose.Schema({
  _id: false,
  product_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product",
    required: [true, " product id is required"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity  is required"],
    min: [1, " minimum quantity should be  1 "],
  },
  price: {
    type: Number,
    min: [1, " invaild price should be positive number"],
    required: [true, "price  is requires"],
  },
});

const address = mongoose.Schema({
  area: {
    type: String,
    required: [true, "area is required"],
  },
  city: { type: String, required: [true, "city is required"] },
  governorate: { type: String, required: [true, "governorate is required"] },
  country: { type: String, required: [true, "country is required"] },
});

const OrderSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    products: [product],
    total_price: {
      type: Number,
      required: [true, "total price is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Complete", "Cancelled"],
      default: "Pending",
    },
    status_history: {
      type: [
        {
          status: {
            type: String,
            enum: ["Pending", "Processing", "Complete", "Cancelled"],
            // required: [true, "status is required"],
          },
          date: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
      default: [{ status: "Pending", date: Date.now() }],
    },
    address: {
      type: address,
      required: [true, "address is required"],
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    payment_method: {
      type: String,
      enum: ["Cash", "Credit Card"],
      default: "Cash",
    },
    payment_id: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    skipVersioning: { dontVersionMe: true },
  }
);

OrderSchema.virtual("order_id").get(function () {
  return this._id;
});

OrderSchema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

OrderSchema.virtual("products.product", {
  ref: "Product",
  localField: "products.product_id",
  foreignField: "_id",
  justOne: true,
});

// update status history

// update status history

// validate if order is not empty

// validate if order is not complete or cancelled
OrderSchema.pre("findOneAndUpdate", function (next) {
  const update = this.model.findOne(this.getFilter());
  if (
    update.status &&
    (update.status === "Cancelled" || update.status === "Complete")
  ) {
    return next(new Error("Order is already cancelled or complete"));
  }
  next();
});
// validate if order is not complete or cancelled

// increase total_orders by quantity for each product and decrease quantity

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
