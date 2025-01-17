import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import Jimp from "jimp";
import path from "path";

const prisma = new PrismaClient();

class ClientsController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const fetchClients = await prisma.client.findMany({
        orderBy: { name: "asc" },
        where: {
          ...(req.query.search && {
            name: { contains: req.query.search as string, mode: "insensitive" },
          }),
        },
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

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const findClient = await prisma.client.findFirst({
        where: { id: Number(req.params.id) },
        include: {
          units: true,
          transactions: { orderBy: { created_at: "desc" } },
        },
      });

      if (!findClient) throw new Error("Cliente não encontrado");

      const calculateDebs = findClient.transactions.reduce((prev, curr) => {
        return curr.type === 1 ? prev + curr.value : prev - curr.value;
      }, 0);

      res.json({
        ...findClient,
        avatar:
          findClient.avatar &&
          `http://localhost:3333/public/avatars/${findClient.avatar}`,
        debts: calculateDebs,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
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

  async update(req: Request, res: Response, next: NextFunction) {
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
            .write(
              path.join(
                __dirname,
                "..",
                "..",
                "uploads",
                "avatars",
                `${imageName}.png`
              )
            );
        });

        avatar = `${imageName}.png`;
      }

      const result = await prisma.client.update({
        where: {
          id: Number(req.params.id),
        },
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
export default new ClientsController();
