import express from "express";

import productsRoutes from "./products.routes";
import categoriesRoutes from "./categories.routes";
import unitsRoutes from "./units.routes";
import clientsRoutes from "./clients.routes";
import transactionsRoutes from "./transactions.routes";
import dashboardRoutes from "./dashboard.routes";

const router = express.Router();

router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/units", unitsRoutes);
router.use("/clients", clientsRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
