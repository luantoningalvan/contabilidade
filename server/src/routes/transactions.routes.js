const express = require("express");
const transactionsController = require("../controllers/TransactionsController");

const router = express.Router();

router.post("/", transactionsController.create);

module.exports = router;
