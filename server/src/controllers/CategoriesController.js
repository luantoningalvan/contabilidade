const conn = require("../db/conn");

class CategoriesController {
  async index(req, res, next) {
    try {
      const fetchCategories = await conn.select("*").from("categories");

      res.json(fetchCategories);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const data = req.body;

    try {
      const createCategory = await conn("categories").insert(
        {
          name: data.name,
          color: data.color,
        },
        ["*"]
      );

      res.json(createCategory[0]);
    } catch (error) {
      next(error);
    }
  }
  s;
}
module.exports = new CategoriesController();
