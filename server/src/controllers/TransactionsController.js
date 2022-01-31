const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TransactionsController {
  async create(req, res, next) {
    const data = req.body;

    try {
      const createTransaction = await prisma.transaction.create({
        data: {
          description: data.description,
          type: data.type,
          value: Math.abs(data.value),
          client_id: data.client,
        },
      });

      res.json(createTransaction);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new TransactionsController();
