import express from "express";
import productsController from "../controllers/ProductsController";

const router = express.Router();

router.get("/", productsController.index);
router.get("/:id", productsController.show);
router.post("/", productsController.create);
router.put("/:id", productsController.update);
router.delete("/:id", productsController.remove);
router.get("/info/:code", productsController.fetchByCode);
router.patch("/:code/barcode", productsController.patchBarCode);

export default router;
