const conn = require("../db/conn");
const { formatMoney } = require("../utils/formatMoney");

class UnitsController {
  async index(req, res, next) {
    try {
      const fetchUnits = await conn
        .select(["products.*", "units.*", "clients.name as client_name"])
        .from("units")
        .where((qb) => {
          if (req.query.cat) {
            qb.where("units.category_id", "=", req.query.cat);
          }

          if (req.query.status) {
            qb.where("units.sold", "=", req.query.status === "1");
          }

          if (req.query.status === "1" && req.query.period) {
            const date = new Date(req.query.period);
            qb.whereBetween("sale_date", [
              new Date(date.getFullYear(), date.getMonth(), 1),
              new Date(date.getFullYear(), date.getMonth(), 31),
            ]);
          }
        })
        .orderBy("sale_date")
        .innerJoin("products", "products.code", "units.product_id")
        .leftJoin("clients", "clients.id", "units.client_id");

      res.json(
        fetchUnits.map((unit) => ({
          ...unit,
          purchase_price: formatMoney(unit.purchase_price),
          sale_price: unit.sold ? formatMoney(unit.sale_price) : null,
          profit: unit.sold
            ? formatMoney(unit.sale_price - unit.purchase_price)
            : null,
        }))
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const data = req.body;

    try {
      Array.from(Array(data.quantity).keys()).forEach(async () => {
        await conn("units").insert(
          {
            product_id: data.product,
            purchase_price: data.price,
            category_id: data.category,
            sold: false,
          },
          ["*"]
        );
      });
      res.json({});
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    const { id: unit_id } = req.params;
    try {
      await conn("units").where("id", unit_id).first().del();
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UnitsController();
