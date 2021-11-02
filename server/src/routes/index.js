const express = require("express");

const productsRoutes = require("./products.routes");
const categoriesRoutes = require("./categories.routes");
const unitsRoutes = require("./units.routes");

const router = express.Router();

router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/units", unitsRoutes);

module.exports = router;
