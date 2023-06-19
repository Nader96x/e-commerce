const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const hpp = require("hpp");
const refresh = require("./Components/github_refresh/refresh");
require("./helpers/Seeder")();
//Middlewares
const { _404, _500 } = require("./MiddelWares/errorsWare");

//Routers
const WebsiteRouter = require("./Routes/Website");
const DashboardRouter = require("./Routes/Dashboard");
const DispatchSystemChangeStatusAPIroutes = require("./Routes/DispatchSystemChangeStatusAPIroutes");

const AuthRouter = require("./Components/Employees/Auth/AuthRouter");
const UserAuthRouter = require("./Components/Users/Website/Auth/AuthRouter");

const app = express();
app.use(
  hpp({
    whitelist: ["total_price", "status", "is_active"],
  })
);
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

// Dispatch System Change Status API
app.use("/dispatch", DispatchSystemChangeStatusAPIroutes);

// Dashboard
app.use("/admin", AuthRouter); // Auth Routes
app.use("/api/v1", v1Router); // versioning Routes
v1Router.use(DashboardRouter); // Dashboard Routes

// Website Routes
app.use("/", WebsiteRouter); // Website Routes
app.use("/", UserAuthRouter); // User Auth Routes

// Error Handlers
app.use(_404); // Not Found Handlers
app.use(_500); // Error Handler

module.exports = app;
