const express = require("express");
const unitsController = require("../controllers/UnitsController");
const salesController = require("../controllers/SalesController");

const router = express.Router();

router.get("/", unitsController.index);
router.get("/:id", unitsController.show);
router.post("/", unitsController.create);
router.put("/:id", unitsController.update);
router.delete("/:id", unitsController.remove);
router.post("/sell", salesController.create);
router.delete("/:id/sell", salesController.delete);

module.exports = router;
