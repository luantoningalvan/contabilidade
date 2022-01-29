const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { formatMoney } = require("../utils/formatMoney");

class UnitsController {
  async index(req, res, next) {
    try {
      const date = new Date(req.query.period);

      const fetchUnits = await prisma.unity.findMany({
        include: {
          client: { select: { name: true } },
          product: { select: { name: true } },
        },
        orderBy: { sale_date: "desc" },
        where: {
          ...(req.query.cat && { category_id: Number(req.query.cat) }),
          ...(req.query.status && { sold: req.query.status === "1" }),
          ...(req.query.status &&
            req.query.period && {
              AND: [{ sale_date: { lte: date } }, { sale_date: { gte: date } }],
            }),
        },
      });

      res.json({
        data: fetchUnits.map((unit) => ({
          id: unit.id,
          client_name: unit.client?.name,
          name: unit.product.name,
          sold: unit.sold,
          purchase_price: formatMoney(unit.purchase_price),
          sale_price: unit.sold ? formatMoney(unit.sale_price) : null,
          sale_date: unit.sale_date,
          profit: unit.sold
            ? formatMoney(unit.sale_price - unit.purchase_price)
            : null,
        })),
        totalizers: fetchUnits.reduce(
          (prev, curr) => {
            return {
              purchases: prev.purchases + curr.purchase_price,
              sales: prev.sales + curr.sale_price,
              profit: curr.sold
                ? prev.profit + (curr.sale_price - curr.purchase_price)
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

  async create(req, res, next) {
    const data = req.body;

    try {
      const dataToInsert = [];

      data.products.forEach((product) =>
        Array(product.quantity)
          .fill(1)
          .forEach(() =>
            dataToInsert.push({
              product_id: Number(product.product),
              purchase_price: product.price,
              category_id: product.category,
              expiration_date: product.expiration_date,
              sold: false,
            })
          )
      );

      const results = await prisma.unity.createMany({
        data: dataToInsert,
        skipDuplicates: false,
      });

      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    const { id: unit_id } = req.params;
    try {
      await prisma.unity.delete({ where: { id: Number(unit_id) } });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UnitsController();
