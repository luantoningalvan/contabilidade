import express from "express";
import clientsController from "../controllers/ClientsController";

const router = express.Router();

router.get("/", clientsController.index);
router.get("/:id", clientsController.show);
router.post("/", clientsController.create);
router.put("/:id", clientsController.update);

export default router;
