const express = require("express");
const ProductsRouter = require("../Components/Products/ProductRouterPublic");
const CategoriesRouter = require("../Components/Categories/CategoriesRouterPublic");
const SettingsRouter = require("../Components/Setting/SettingsRouterPublic");

const Router = express.Router();
Router.use("/products", ProductsRouter);
Router.use("/categories", CategoriesRouter);

Router.use("/", SettingsRouter);
module.exports = Router;
