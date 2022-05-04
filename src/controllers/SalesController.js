const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SalesController {
  async create(req, res, next) {
    const data = req.body;
    const { id: unit_id } = req.params;

    try {
      const updateUnit = await prisma.unit.update({
        where: { id: Number(unit_id) },
        data: {
          client_id: data.client,
          sale_price: data.sale_price,
          sold: true,
          sale_date: !!data.sale_date ? new Date(data.sale_date) : new Date(),
        },
        include: { product: true },
      });

      await prisma.transaction.create({
        data: {
          description: updateUnit.product.name,
          type: 2,
          value: data.sale_price,
          client_id: data.client,
          unit_id: Number(unit_id),
        },
      });

      res.json(updateUnit);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    const { id: unit_id } = req.params;

    try {
      const updateUnit = await prisma.unit.update({
        where: { id: Number(unit_id) },
        data: {
          client_id: null,
          sale_price: null,
          sold: false,
          sale_date: null,
        },
        include: { product: true },
      });

      await prisma.transaction.delete({
        where: {
          unit_id: Number(unit_id),
        },
      });

      res.json(updateUnit);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new SalesController();
