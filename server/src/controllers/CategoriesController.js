const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CategoriesController {
  async index(req, res, next) {
    try {
      const fetchCategories = await prisma.category.findMany();

      res.json(fetchCategories);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const data = req.body;

    try {
      const createCategory = await prisma.category.create({
        data: {
          name: data.name,
          color: data.color,
        },
      });

      res.json(createCategory);
    } catch (error) {
      next(error);
    }
  }
  s;
}
module.exports = new CategoriesController();
