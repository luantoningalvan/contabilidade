import { Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { formatMoney } from "../utils/formatMoney";

class UnitsController {
  async index(req: Request, res: Response, next: NextFunction) {
    function getDate() {
      const dt = new Date(req.query.period as string);
      const month = dt.getMonth();
      const year = dt.getFullYear();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      return { firstDay, lastDay };
    }

    try {
      const fetchUnits = await prisma.unit.findMany({
        include: {
          client: { select: { name: true } },
          product: { select: { name: true, id: true } },
        },
        orderBy: {
          ...(req.query.orderBy && {
            [req.query.orderBy as string]: req.query.sort || "asc",
          }),
        },
        where: {
          ...(req.query.search && {
            product: {
              name: {
                contains: req.query.search as string,
                mode: "insensitive",
              },
            },
          }),
          ...(req.query.cat && { category_id: Number(req.query.cat) }),
          ...(req.query.status && { sold: req.query.status === "2" }),
          ...(req.query.status &&
            req.query.period && {
              AND: [
                { sale_date: { lte: getDate().lastDay } },
                { sale_date: { gte: getDate().firstDay } },
              ],
            }),
        },
      });

      res.json({
        data: fetchUnits.map((unit) => ({
          id: unit.id,
          client_name: unit.client?.name,
          name: unit.product.name,
          product_id: unit.product.id,
          sold: unit.sold,
          purchase_price: formatMoney(unit.purchase_price),
          sale_price: unit.sold ? formatMoney(unit.sale_price!) : null,
          sale_date: new Intl.DateTimeFormat("pt-BR", {
            timeZone: "UTC",
          }).format(unit.sale_date!),
          expiration_date: new Intl.DateTimeFormat("pt-BR", {
            timeZone: "UTC",
            month: "2-digit",
            year: "2-digit",
          }).format(unit.expiration_date!),
          profit: unit.sold
            ? formatMoney(unit.sale_price! - unit.purchase_price)
            : null,
        })),
        totalizers: fetchUnits.reduce(
          (prev, curr) => {
            return {
              purchases: prev.purchases + curr.purchase_price,
              sales: prev.sales + curr.sale_price!,
              profit: curr.sold
                ? prev.profit + (curr.sale_price! - curr.purchase_price)
                : prev.profit,
            };
          },
          {
            purchases: 0,
            sales: 0,
            profit: 0,
          }
        ),
      });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const findUnit = await prisma.unit.findFirst({
        where: { id: Number(req.params.id) },
        include: { product: true },
      });

      res.json(findUnit);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const data = req.body;

    try {
      const dataToInsert: Prisma.UnitCreateManyInput[] = [];

      data.products.forEach((product: any) =>
        Array(product.quantity)
          .fill(1)
          .forEach(() =>
            dataToInsert.push({
              product_id: Number(product.product),
              purchase_price: product.price,
              category_id: product.category,
              expiration_date: new Date(product.expiration_date),
              sold: false,
            })
          )
      );

      const results = await prisma.unit.createMany({
        data: dataToInsert,
        skipDuplicates: false,
      });

      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const { id: unit_id } = req.params;

    try {
      const updateUnit = await prisma.unit.update({
        where: { id: Number(unit_id) },
        data: {
          purchase_price: data.price,
          expiration_date: new Date(data.expiration_date),
          ...(data.sale_price &&
            data.sale_date && {
              sale_price: data.sale_price,
              sale_date: new Date(data.sale_date),
            }),
        },
      });

      res.json(updateUnit);
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const { id: units_ids } = req.params;

    const units_ids_array = units_ids.split(",").map(Number);

    try {
      await prisma.unit.deleteMany({
        where: { id: { in: units_ids_array } },
      });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  }
}
export default new UnitsController();
