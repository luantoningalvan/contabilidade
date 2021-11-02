const conn = require("../db/conn");

class ClientsController {
  async index(req, res, next) {
    try {
      const fetchClients = await conn.select("*").from("clients");

      res.json(fetchClients);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const data = req.body;

    try {
      const result = await conn("clients").insert(
        {
          name: data.name,
        },
        ["*"]
      );
      res.json(result[0]);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ClientsController();
