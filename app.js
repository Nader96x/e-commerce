const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const AuthRouter = require("./Components/Employees/Auth/AuthRouter");
const EmployeeRouter = require("./Components/Employees/EmployeeRouter");
const CategoriesRouter = require("./Components/Categories/CategoriesRouter");
const SettingsRouter = require("./Components/Setting/SettingRouter");
const ProductsRouter = require("./Components/Products/ProductsRouter");
const UsersRouter = require("./Components/Users/UsersRouter");
const OrderRouter = require("./Components/Order/OrdersRouter")
const RolesRouter = require("./Components/Roles/RolesRouter")

const app = express();
const v1Router = express.Router();
// MiddleWares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // log the URL
}

app.use(cors());
app.use(express.json());

// Routes
app.use("/settings", SettingsRouter);

// Dashboard Route
app.use("/admin", AuthRouter);

// V1 Routes
v1Router.use("/employees", EmployeeRouter);
v1Router.use("/categories", CategoriesRouter);
v1Router.use("/products", ProductsRouter);
v1Router.use("/users", UsersRouter);
v1Router.use("/orders", OrderRouter);
v1Router.use("/roles", RolesRouter);

// versioning Routes
app.use("/api/v1", v1Router);

// Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ status: "fail", error: "Not Found" });
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ status: "fail", error: err.message });
});

module.exports = app;
