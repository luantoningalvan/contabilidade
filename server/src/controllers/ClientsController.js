const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

const extesions = {
  "/": "jpg",
  i: "png",
  R: "gif",
  U: "webp",
  P: "svg",
};
class ClientsController {
  async index(req, res, next) {
    try {
      const fetchClients = await prisma.client.findMany({
        orderBy: { name: "asc" },
      });

      res.json(
        fetchClients.map((client) => ({
          ...client,
          avatar: `http://localhost:3333/public/avatars/${client.avatar}`,
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
        const base64 = req.body.avatar.replace(/^data:image\/png;base64,/, "");
        const extension = base64.charAt(0);

        const imageName = `${(Math.random() + 1).toString(36).substring(7)}.${
          extesions[extension]
        }`;

        fs.writeFileSync(`uploads/avatars/${imageName}`, base64, "base64");

        avatar = imageName;
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
