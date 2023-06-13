const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const refresh = require("./Components/github_refresh/refresh");

//Middlewares
const { _404, _500 } = require("./MiddelWares/errorsWare");

//Routers
const WebsiteRouter = require("./Routes/Website");
const DashboardRouter = require("./Routes/Dashboard");

const AuthRouter = require("./Components/Employees/Auth/AuthRouter");
const UserAuthRouter = require("./Components/Users/Website/Auth/AuthRouter");

const WebUsersRouter = require("./Components/Users/Website/UsersRouter");

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

//  Github Refresh Route
app.use("/refresh", refresh);

// Dashboard
app.use("/admin", AuthRouter); // Auth Routes
app.use("/api/v1", v1Router); // versioning Routes
v1Router.use(DashboardRouter); // Dashboard Routes

// Website Routes
app.use("/", WebsiteRouter); // Website Routes
app.use("/", UserAuthRouter); // User Auth Routes
app.use("/profile", WebUsersRouter); // User Profile Routes

// Error Handlers
app.use(_404); // Not Found Handlers
app.use(_500); // Error Handler

module.exports = app;
