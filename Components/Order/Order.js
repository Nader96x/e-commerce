const mongoose = require("mongoose");
const Product = require("../Products/Product");
const ApiError = require("../../Utils/ApiError");

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
OrderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.status_history.push({
      status: this.status,
      date: Date.now(),
    });
  }
  next();
});
// validate if order is not empty

// validate if order is not complete or cancelled

// validate if order is not complete or cancelled
OrderSchema.pre("findOneAndUpdate", async function (next) {
  const filter = this.getFilter();
  const order = await this.model.findOne(filter);
  if (!order) {
    return next(new Error("Order not found"));
  }
  if (order.status !== "Pending") {
    return next(new ApiError("Sorry, this order cannot be Cancelled", 400));
  }
  next();
});
// increase total_orders by quantity for each product and decrease quantity

OrderSchema.post("create", async function (next) {
  try {
    for (let i = 0; i < this.products.length; i++) {
      const product = await Product.findById(this.products[i].product_id);
      product.total_orders += this.products[i].quantity;
      product.quantity -= this.products[i].quantity;
      await product.save();
    }
  } catch (err) {
    console.log(err);
  }
});

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
