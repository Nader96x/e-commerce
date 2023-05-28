const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const AuthRouter = require("./Components/Employees/Auth/AuthRouter");
const EmployeeRouter = require("./Components/Employees/EmployeeRouter");
const CategoriesRouter = require("./Components/Categories/CategoriesRouter");
const SettingsRouter = require("./Components/Setting/SettingRouter");

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
