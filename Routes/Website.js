const express = require("express");
const ProductsRouter = require("../Components/Products/ProductRouterPublic");
const CategoriesRouter = require("../Components/Categories/CategoriesRouterPublic");
const SettingsRouter = require("../Components/Setting/SettingsRouterPublic");
const OrdersRouter = require("../Components/Order/Website/OrdersRouter");
const UsersRouter = require("../Components/Users/Website/UsersRouter");
const ContactUsController = require("../Components/Contact-Us/ContactUsController");

const Router = express.Router();

/*Router.use((req, res, next) => {
  // console.log(req.headers["Accept-Language"]);
  if (!["ar", "en"].includes(req.headers["Accept-Language"]?.toLowerCase()))
    req.headers["Accept-Language"] = "ar";

  req.lang = req.headers["Accept-Language"]?.toLowerCase() || "ar";

  next();
});*/

Router.use("/products", ProductsRouter);
Router.use("/categories", CategoriesRouter);

Router.use("/orders", OrdersRouter);
Router.use("/profile", UsersRouter);

Router.use("/", SettingsRouter);
Router.post("/contact-us", ContactUsController.createContactUs);
module.exports = Router;
