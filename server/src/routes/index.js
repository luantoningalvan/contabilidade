const express = require("express");

const productsRoutes = require("./products.routes");
const categoriesRoutes = require("./categories.routes");
const unitsRoutes = require("./units.routes");
const clientsRoutes = require("./clients.routes");
const transactionsRoutes = require("./transactions.routes");
const dashboardRoutes = require("./dashboard.routes");

const router = express.Router();

router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/units", unitsRoutes);
router.use("/clients", clientsRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
