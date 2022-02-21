const express = require("express");
const clientsController = require("../controllers/ClientsController");

const router = express.Router();

router.get("/", clientsController.index);
router.get("/:id", clientsController.show);
router.post("/", clientsController.create);
router.put("/:id", clientsController.update);

module.exports = router;