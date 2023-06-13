const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const refresh = require("./Components/github_refresh/refresh");

//Middlewares
const ErrorWare = require("./MiddelWares/errorWare");

//Routers
const WebsiteRouter = require("./Routes/Website");
const AuthRouter = require("./Components/Employees/Auth/AuthRouter");
const UserAuthRouter = require("./Components/Users/Website/Auth/AuthRouter");
const EmployeeRouter = require("./Components/Employees/EmployeeRouter");
const CategoriesRouter = require("./Components/Categories/CategoriesRouter");
const SettingsRouter = require("./Components/Setting/SettingRouter");
const ProductsRouter = require("./Components/Products/ProductsRouter");
const DashUsersRouter = require("./Components/Users/Dashboard/UsersRouter");
const WebUsersRouter = require("./Components/Users/Website/UsersRouter");
const OrderRouter = require("./Components/Order/OrdersRouter");
const RolesRouter = require("./Components/Roles/RolesRouter");

const app = express();
const v1Router = express.Router();
// MiddleWares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // log the URL
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.env.PUBLIC_FOLDER || "public"));
// Refresh Route
app.use("/refresh", refresh);

// Website Routes
app.use("/settings", SettingsRouter);
app.use("/", WebsiteRouter);
// Dashboard Route
app.use("/admin", AuthRouter);
app.use("/", UserAuthRouter);
app.use("/profile", WebUsersRouter);

// V1 Routes
v1Router.get("/routes", (req, res) => {
  const routes = [
    "categories",
    "products",
    "users",
    "roles",
    "employees",
    "orders",
  ];
  res.json({
    message: "success",
    data: { routes, ban: ["users", "employees"] },
  });
});
v1Router.use("/employees", EmployeeRouter);
v1Router.use("/categories", CategoriesRouter);
v1Router.use("/products", ProductsRouter);
v1Router.use("/users", DashUsersRouter);
v1Router.use("/orders", OrderRouter);
v1Router.use("/roles", RolesRouter);

// versioning Routes
app.use("/api/v1", v1Router);

// Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ status: "fail", error: "Not Found" });
});

// Error Handler
app.use(ErrorWare);

module.exports = app;
