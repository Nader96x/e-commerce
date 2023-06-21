const mongoose = require("mongoose");
const Product = require("../Products/Product");
const User = require("../Users/User");
const EmailSender = require("../../Utils/emailSender");

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
    required: [true, "Name English  is Missing"],
  },
  name_ar: {
    type: String,
    required: [true, "Name Arabic is Missing"],
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
      enum: ["Pending", "Paid", "Cancelled"],
      default: "Pending",
    },
    payment_method: {
      type: String,
      enum: ["Cash", "Credit Card"],
      default: "Cash",
    },
    payment_id: String,
    payment_url: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    skipVersioning: { dontVersionMe: true },
  }
);

OrderSchema.pre(/^find/, function (next) {
  this.populate("user");
  this.populate("products.product_details");
  next();
});

OrderSchema.virtual("order_id").get(function () {
  return this._id;
});

OrderSchema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

OrderSchema.virtual("products.product_details", {
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
    const url = `${process.env.FRONTEND_URL}/orders/OrderDetail/${this._id}`;
    // get user from this and send email
    User.findById(this.user_id)
      .then((user) => {
        const email = new EmailSender(user, url, this);
        email.sendStatusChange(); // I know this is async, but I don't want to wait for it
      })
      .catch((err) => {
        console.log(err);
      });
  }
  this.updatedAt = Date.now();
  next();
});

OrderSchema.pre("save", async function (next) {
  if (this.isModified("status")) {
    if (this.status === "Cancelled") {
      for (let i = 0; i < this.products.length; i++) {
        // eslint-disable-next-line no-shadow,no-await-in-loop
        const product = await Product.findById(this.products[i].product_id);
        product.total_orders -= this.products[i].quantity;
        product.quantity += this.products[i].quantity;
        // eslint-disable-next-line no-await-in-loop
        await product.save();
      }
    }
  }
  if (this.isNew) {
    for (let i = 0; i < this.products.length; i++) {
      // eslint-disable-next-line no-shadow,no-await-in-loop
      const product = await Product.findById(this.products[i].product_id);
      product.total_orders += this.products[i].quantity;
      product.quantity -= this.products[i].quantity;
      // eslint-disable-next-line no-await-in-loop
      await product.save();
    }
  }

  next();
});

OrderSchema.methods = {
  toJSON() {
    return {
      _id: this._id.toHexString(),
      user_id: this.user_id,
      user: this.user,
      status: this.status,
      status_history: this.status_history,
      payment_status: this.payment_status,
      payment_method: this.payment_method,
      payment_id: this.payment_id,
      payment_url: this.payment_url,
      products: this.products,
      total_price: this.total_price,
      address: this.address,
      createdAt: this.createdAt,
      order_id: this._id.toHexString(),
      id: this._id.toHexString(),
    };
  },
};

OrderSchema.statics = {
  async countOrders() {
    return await this.countDocuments();
  },
  async getOrdersPerMonth(orderStatus) {
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
          no: "$_id.month",
        },
      },
    ]);
  },
  async totalOrdersPrice() {
    return await this.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$total_price" },
        },
      },
      {
        $project: {
          _id: 0,
          totalPrice: 1,
        },
      },
    ]);
  },
};

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
