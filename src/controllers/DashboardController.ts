import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DashboardController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const sales = await prisma.unit.aggregate({
        where: { sold: true },
        _sum: { sale_price: true, purchase_price: true },
      });

      const findTransactions = await prisma.transaction.groupBy({
        by: ["type"],
        _sum: { value: true },
      });

      const groupSalesByProduct = await prisma.unit.groupBy({
        where: { sold: true },
        by: ["product_id"],
        _count: { id: true },
        _sum: { purchase_price: true, sale_price: true },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 5,
      });

      const groupSalesByClient = await prisma.unit.groupBy({
        where: { sold: true },
        by: ["client_id"],
        _count: { id: true },
        _sum: { sale_price: true },
        orderBy: {
          _sum: {
            sale_price: "desc",
          },
        },
        take: 5,
      });

      const groupSalesByCategory = await prisma.unit.groupBy({
        where: { sold: true },
        by: ["category_id"],
        _sum: { sale_price: true },
      });

      const bestSellersProducts = await prisma.product.findMany({
        where: {
          id: {
            in: groupSalesByProduct.map(({ product_id }) => product_id),
          },
        },
      });

      const bestBuyersClients = await prisma.client.findMany({
        where: {
          id: {
            in: groupSalesByClient.map(({ client_id }) => client_id!),
          },
        },
      });

      const salesByCategoryCatergories = await prisma.category.findMany({
        where: {
          id: {
            in: groupSalesByCategory.map(({ category_id }) => category_id),
          },
        },
      });

      const salesByCategory = groupSalesByCategory.map((sell) => {
        const findMatchCategory = salesByCategoryCatergories.find(
          ({ id }) => id === sell.category_id
        );

        return {
          totalSales: sell._sum.sale_price,
          category: findMatchCategory,
        };
      });

      const bestSellers = groupSalesByProduct.map((sell) => {
        const findMatchProduct = bestSellersProducts.find(
          ({ id }) => id === sell.product_id
        );

        if (!findMatchProduct) {
          return null;
        }

        return {
          product_id: sell.product_id,
          totalUnits: sell._count.id,
          totalProfit: sell._sum.sale_price! - sell._sum.purchase_price!,
          product: {
            name: findMatchProduct.name,
            thumb: `http://localhost:3333/public/thumb-${findMatchProduct.natCode}.jpg`,
          },
        };
      });

      const bestClients = groupSalesByClient.map((sell) => {
        const findMatchClient = bestBuyersClients.find(
          ({ id }) => id === sell.client_id
        );

        if (!findMatchClient) {
          return null;
        }

        return {
          totalSales: sell._sum.sale_price,
          client: {
            ...findMatchClient,
            avatar:
              findMatchClient.avatar &&
              `http://localhost:3333/public/avatars/${findMatchClient.avatar}`,
          },
        };
      });

      const totalReceivable = findTransactions.reduce(
        (prev, curr) =>
          curr.type === 1 ? prev - curr._sum.value! : prev + curr._sum.value!,
        0
      );

      const totalClients = await prisma.client.count();
      const totalProfit = sales._sum.sale_price! - sales._sum.purchase_price!;
      const totalSales = sales._sum.sale_price || 0;

      const salesPerMonth: any = await prisma.$queryRaw`
        SELECT date_trunc('month', sale_date) 
        AS month, sum(sale_price) as monthly_sum
        FROM "public"."Unit"
        WHERE sold=true
        GROUP BY month
      `;

      let months = Array(12).fill(null);

      salesPerMonth.forEach((month: any) => {
        const pickMonth = Number(month.month.substring(5, 7));
        months[pickMonth - 1] = month.monthly_sum;
      });

      const profitPercentage = Math.round((totalProfit * 100) / totalSales);

      res.send({
        salesPerMonth: months,
        totalClients: totalClients,
        totalReceivable: totalReceivable,
        totalSales: totalSales,
        totalProfit: totalProfit,
        bestSellers,
        salesByCategory,
        bestClients,
        profitPercentage,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
