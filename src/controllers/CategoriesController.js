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

  async show(req, res, next) {
    try {
      const fetchCategory = await prisma.category.findFirst({
        where: { id: Number(req.params.id) },
      });

      res.json(fetchCategory);
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

  async update(req, res, next) {
    const data = req.body;

    try {
      const result = await prisma.category.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          color: data.color,
          name: data.name,
        },
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new CategoriesController();
