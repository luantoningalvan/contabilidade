import express from "express";
import unitsController from "../controllers/UnitsController";
import salesController from "../controllers/SalesController";

const router = express.Router();

router.get("/", unitsController.index);
router.get("/:id", unitsController.show);
router.post("/", unitsController.create);
router.put("/:id", unitsController.update);
router.delete("/:id", unitsController.remove);
router.post("/sell", salesController.create);
router.delete("/:id/sell", salesController.delete);

export default router;
