const AsyncHandler = require("express-async-handler");
const Product = require("../Products/Product");
const Category = require("../Categories/Category");
const Order = require("../Order/Order");
const User = require("../Users/User");

module.exports.getStatics = AsyncHandler(async (req, res, next) => {
  const topProducts = await Product.getTopProducts();
  const numberOfProducts = await Product.countProducts();
  const numberOfCategories = await Category.countCategories();
  const numberOfUsers = await User.countUsers();
  const numberOfOrders = await Order.countOrders();
  const sales = await Order.totalOrdersPrice();
  const completedOrdersInLastSixMonths = await Order.getOrdersPerMonth(
    "Completed"
  );
  const cancelledOrdersInLastSixMonths = await Order.getOrdersPerMonth(
    "Cancelled"
  );
  const processingOrdersFromLastSixMonths = await Order.getOrdersPerMonth(
    "Processing"
  );
  res.status(200).json({
    status: "success",
    data: {
      numberOfUsers,
      numberOfCategories,
      numberOfProducts,
      numberOfOrders,
      sales: sales[0].totalPrice,
      completedOrdersInLastSixMonths,
      cancelledOrdersInLastSixMonths,
      processingOrdersFromLastSixMonths,
      topProducts,
    },
  });
});
