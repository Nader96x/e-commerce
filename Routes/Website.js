const express = require("express");
const ProductsRouter = require("../Components/Products/ProductRouterPublic");

const Router = express.Router();
Router.use("/products", ProductsRouter);

module.exports = Router;
