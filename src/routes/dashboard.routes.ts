import express from "express";
import dashboardController from "../controllers/DashboardController";

const router = express.Router();

router.get("/", dashboardController.index);

export default router;
