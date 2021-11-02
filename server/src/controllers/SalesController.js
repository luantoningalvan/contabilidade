const conn = require("../db/conn");

class SalesController {
  async create(req, res, next) {
    const data = req.body;
    const { id: unit_id } = req.params;

    try {
      const updateUnit = await conn("units")
        .where({ id: unit_id })
        .first()
        .update(
          {
            client_id: data.client,
            sale_price: data.sale_price,
            sold: true,
            sale_date: new Date(),
          },
          "*"
        );
      res.json(updateUnit);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new SalesController();
