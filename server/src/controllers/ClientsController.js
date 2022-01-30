const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ClientsController {
  async index(req, res, next) {
    try {
      const fetchClients = await prisma.client.findMany({
        orderBy: { name: "asc" },
      });

      res.json(fetchClients);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const data = req.body;

    try {
      const result = await prisma.client.create({
        data: {
          name: data.name,
        },
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ClientsController();
