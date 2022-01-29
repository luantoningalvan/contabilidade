const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SalesController {
  async create(req, res, next) {
    const data = req.body;
    const { id: unit_id } = req.params;

    try {
      const updateUnit = prisma.unity.update({
        where: { id: unit_id },
        data: {
          client_id: data.client,
          sale_price: data.sale_price,
          sold: true,
          sale_date: new Date(),
        },
      });

      res.json(updateUnit);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new SalesController();
