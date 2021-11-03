const express = require("express");
const unitsController = require("../controllers/UnitsController");
const salesController = require("../controllers/SalesController");

const router = express.Router();

router.get("/", unitsController.index);
router.post("/", unitsController.create);
router.delete("/:id", unitsController.remove);
router.post("/:id/sell", salesController.create);

module.exports = router;
