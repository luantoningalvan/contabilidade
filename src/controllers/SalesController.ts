import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class SalesController {
  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    let results = [];

    try {
      for (const unit of data) {
        const updateUnit = await prisma.unit.update({
          where: { id: unit.unit_id },
          data: {
            client_id: unit.client,
            sale_price: unit.sale_price,
            sold: true,
            sale_date: !!unit.sale_date ? new Date(unit.sale_date) : new Date(),
          },
          include: { product: true },
        });

        await prisma.transaction.create({
          data: {
            description: updateUnit.product.name!,
            type: 2,
            value: unit.sale_price,
            client_id: unit.client,
            unit_id: unit.unit_id,
          },
        });

        results.push(updateUnit);
      }

      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
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
export default new SalesController();
