const express = require("express");
const categoriesController = require("../controllers/CategoriesController");

const router = express.Router();

router.get("/", categoriesController.index);
router.post("/", categoriesController.create);

module.exports = router;
