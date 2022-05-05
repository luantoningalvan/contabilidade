import express from "express";
import transactionsController from "../controllers/TransactionsController";

const router = express.Router();

router.post("/", transactionsController.create);

export default router;
