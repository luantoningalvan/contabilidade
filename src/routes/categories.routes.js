const express = require("express");
const categoriesController = require("../controllers/CategoriesController");

const router = express.Router();

router.get("/", categoriesController.index);
router.get("/:id", categoriesController.show);
router.post("/", categoriesController.create);
router.put("/:id", categoriesController.update);

module.exports = router;
