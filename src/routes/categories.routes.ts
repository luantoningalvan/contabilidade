import express from "express";
import categoriesController from "../controllers/CategoriesController";

const router = express.Router();

router.get("/", categoriesController.index);
router.get("/:id", categoriesController.show);
router.post("/", categoriesController.create);
router.put("/:id", categoriesController.update);

export default router;
