const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const Jimp = require("jimp");

class ClientsController {
  async index(req, res, next) {
    try {
      const fetchClients = await prisma.client.findMany({
        orderBy: { name: "asc" },
      });

      res.json(
        fetchClients.map((client) => ({
          ...client,
          avatar:
            client.avatar &&
            `http://localhost:3333/public/avatars/${client.avatar}`,
        }))
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const data = req.body;

    try {
      let avatar;

      if (req.body.avatar) {
        const base64 = req.body.avatar.split(",")[1];
        const imageName = (Math.random() + 1).toString(36).substring(7);

        Jimp.read(Buffer.from(base64, "base64"), (err, photo) => {
          if (err) throw err;
          photo
            .resize(256, 256)
            .quality(60)
            .write(`uploads/avatars/${imageName}.png`); // save
        });

        avatar = `${imageName}.png`;
      }

      const result = await prisma.client.create({
        data: {
          name: data.name,
          birthday: new Date(data.birthday),
          avatar,
        },
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ClientsController();
