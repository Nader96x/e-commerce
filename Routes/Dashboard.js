const express = require("express");

const SettingsRouter = require("../Components/Setting/SettingRouter");
const EmployeeRouter = require("../Components/Employees/EmployeeRouter");
const CategoriesRouter = require("../Components/Categories/CategoriesRouter");
const ProductsRouter = require("../Components/Products/ProductsRouter");
const RolesRouter = require("../Components/Roles/RolesRouter");
const OrderRouter = require("../Components/Order/Dashboard/OrdersRouter");
const DashUsersRouter = require("../Components/Users/Dashboard/UsersRouter");
const StaticsRouter = require("../Components/Statics/StaticsRouter");
const ContactUsRouter = require("../Components/Contact-Us/ContactUsRouter");
const {
  protect,
  authorized,
} = require("../Components/Employees/Auth/AuthController");

const Router = express.Router();
Router.get("/routes", (req, res) => {
  const routes = [
    "categories",
    "products",
    "users",
    "roles",
    "employees",
    "orders",
    "settings",
  ];
  res.json({
    message: "success",
    data: {
      routes,
      // , ban: ["users", "employees"]
    },
  });
});

Router.use(protect);
Router.use("/statics", StaticsRouter);
Router.use("/customers-contact", ContactUsRouter);
Router.use(authorized);
Router.use("/employees", EmployeeRouter);
Router.use("/categories", CategoriesRouter);
Router.use("/products", ProductsRouter);
Router.use("/roles", RolesRouter);
Router.use("/users", DashUsersRouter);
Router.use("/orders", OrderRouter);
Router.use("/settings", SettingsRouter);

module.exports = Router;
