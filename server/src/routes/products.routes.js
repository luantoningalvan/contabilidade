const express = require("express");
const productsController = require("../controllers/ProductsController");

const router = express.Router();

router.get("/", productsController.index);

module.exports = router;
