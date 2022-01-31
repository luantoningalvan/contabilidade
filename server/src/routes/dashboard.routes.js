const express = require("express");
const dashboardController = require("../controllers/DashboardController");

const router = express.Router();

router.get("/", dashboardController.index);

module.exports = router;
