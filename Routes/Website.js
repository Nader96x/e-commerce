const express = require("express");
const ProductsRouter = require("../Components/Products/ProductRouterPublic");
const CategoriesRouter = require("../Components/Categories/CategoriesRouterPublic");

const Router = express.Router();
Router.use("/products", ProductsRouter);
Router.use("/categories", CategoriesRouter);

module.exports = Router;
