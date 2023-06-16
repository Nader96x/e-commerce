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
    min: [1, " invalid price should be positive number"],
    required: [true, "price  is Missing"],
  },
  name_en: {
    type: String,
    required: [true, "Name  is Missing"],
  },
  image: {
    type: String,
    required: [true, "image is Missing"],
  },
});

const address = mongoose.Schema({
  _id: false,
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
      min: [1, " invalid price should be positive number"],
      // currency: "EGP",
      required: [true, "total price is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },
    status_history: {
      type: [
        {
          _id: false,
          status: {
            type: String,
            enum: ["Pending", "Processing", "Completed", "Cancelled"],
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
});

// update status history
OrderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.status_history.push({
      status: this.status,
      date: Date.now(),
    });
  }
  this.updatedAt = Date.now();
  next();
});

// validate if order is not Pending
OrderSchema.pre("findOneAndUpdate", async function (next) {
  const filter = this.getFilter();
  const order = await this.model.findOne(filter);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  if (order.status !== "Pending") {
    return next(
      new ApiError(
        `Sorry, ${order.status} order cannot be changed To ${this._update.status}`,
        400
      )
    );
  }
  this.updatedAt = Date.now();
  next();
});
// increase total_orders by quantity for each product and decrease quantity

OrderSchema.post("save", async function (next) {
  try {
    for (let i = 0; i < this.products.length; i++) {
      // eslint-disable-next-line no-shadow,no-await-in-loop
      const product = await Product.findById(this.products[i].product_id);
      product.total_orders += this.products[i].quantity;
      product.quantity -= this.products[i].quantity;
      // eslint-disable-next-line no-await-in-loop
      await product.save();
    }
  } catch (err) {
    console.log(err);
  }
});

OrderSchema.statics.countOrders = async function () {
  return await this.countDocuments();
};

OrderSchema.statics.getOrdersPerMonth = async function (orderStatus) {
  // console.log(new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1));
  // console.log(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  // console.log(new Date(Date.now()));
  return await this.aggregate([
    {
      $match: {
        status: orderStatus,
        createdAt: {
          $gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 6,
            1
          ),
          $lte: new Date(Date.now()),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $let: {
            vars: {
              months: [
                "",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
            },
            in: {
              $arrayElemAt: ["$$months", "$_id.month"],
            },
          },
        },
        count: 1,
      },
    },
  ]);
};

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
