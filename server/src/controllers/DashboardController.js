const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DashboardController {
  async index(req, res, next) {
    try {
      const sales = await prisma.unit.aggregate({
        where: { sold: true },
        _sum: { sale_price: true, purchase_price: true },
      });

      const findTransactions = await prisma.transaction.groupBy({
        by: ["type"],
        _sum: { value: true },
      });

      const totalReceivable = findTransactions.reduce(
        (prev, curr) =>
          curr.type === 1 ? prev - curr._sum.value : prev + curr._sum.value,
        0
      );

      const totalClients = await prisma.client.count();
      const totalProfit = sales._sum.sale_price - sales._sum.purchase_price;
      const totalSales = sales._sum.sale_price;

      res.send({
        totalClients: totalClients,
        totalReceivable: totalReceivable,
        totalSales: totalSales,
        totalProfit: totalProfit,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
