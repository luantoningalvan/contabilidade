const conn = require("../db/conn");

class ProductsController {
  async index(req, res, next) {
    try {
      const fetchProducts = await conn.select("*").from("products");

      res.json(fetchProducts);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ProductsController();
