const express = require("express");
const ProductsRouter = require("../Components/Products/ProductRouterPublic");
const CategoriesRouter = require("../Components/Categories/CategoriesRouterPublic");
const OrdersRouter = require("../Components/Order/Website/OrdersRouter");
const UsersRouter = require("../Components/Users/Website/UsersRouter");

const Router = express.Router();
Router.use("/products", ProductsRouter);
Router.use("/categories", CategoriesRouter);
Router.use("/orders", OrdersRouter);
Router.use("/profile", UsersRouter);
module.exports = Router;
