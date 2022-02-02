const express = require("express");
const productsController = require("../controllers/ProductsController");

const router = express.Router();

router.get("/", productsController.index);
router.get("/:id", productsController.show);
router.post("/", productsController.create);
router.put("/:id", productsController.update);
router.delete("/:id", productsController.remove);
router.get("/info/:code", productsController.fetchByCode);
router.patch("/:code/barcode", productsController.patchBarCode);

module.exports = router;
