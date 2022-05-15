import express from "express";
import importerController from "../controllers/ImporterController";

const router = express.Router();

router.post("/", importerController.create);

export default router;
