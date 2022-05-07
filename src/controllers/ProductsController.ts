import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

class ProductsController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const fetchProducts = await prisma.product.findMany({
        include: { _count: { select: { units: true } } },
        orderBy: { name: "asc" },
        where: {
          ...(req.query.search && {
            name: { contains: req.query.search as string, mode: "insensitive" },
          }),
        },
      });

      res.json(
        fetchProducts.map((p) => ({
          id: p.id,
          name: p.name,
          natCode: p.natCode,
          barCode: p.barCode,
          original_price: p.original_price,
          thumb: `http://localhost:3333/public/thumb-${p.natCode}.jpg`,
          totalUnits: p?._count?.units || 0,
        }))
      );
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const findProduct = await prisma.product.findFirst({
        where: { id: Number(req.params.id) },
        include: { units: true },
      });

      if (!findProduct) throw new Error("Produto não encontrado");

      res.json({
        ...findProduct,
        units: findProduct.units.map((unit) => ({
          ...unit,
          expiration_date: new Intl.DateTimeFormat("pt-BR", {
            timeZone: "UTC",
          }).format(unit.expiration_date!),
        })),
        thumb: `http://localhost:3333/public/thumb-${findProduct.natCode}.jpg`,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const findDuplicate = await prisma.product.findFirst({
        where: { natCode: req.body.natCode },
      });

      if (findDuplicate) throw new Error("Código já cadastrado");

      const createProduct = await prisma.product.create({ data: req.body });

      res.json(createProduct);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const findDuplicate = await prisma.product.findFirst({
        where: {
          natCode: req.body.natCode,
          id: { not: Number(req.params.id) },
        },
      });

      if (findDuplicate) throw new Error("Código já cadastrado");

      const updateProduct = await prisma.product.update({
        where: { id: Number(req.params.id) },
        data: req.body,
      });

      res.json(updateProduct);
    } catch (error) {
      next(error);
    }
  }

  async patchBarCode(req: Request, res: Response, next: NextFunction) {
    try {
      const createProduct = await prisma.product.update({
        where: { id: Number(req.params.code) },
        data: { barCode: req.body.barCode },
      });

      res.json(createProduct);
    } catch (error) {
      next(error);
    }
  }

  async fetchByCode(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;

      if (!code) throw new Error("Código não informado");

      try {
        let title;
        let thumbnail;

        try {
          const fetchPage = await axios.get(
            `https://commerce.natura.com.br/rest/api/get/product/detail/${code}`
          );
          title = fetchPage.data.title;
        } catch (error) {}

        try {
          const downloadImage = await axios.get(
            `https://images.rede.natura.net/image/sku/145x145/${code}_1.jpg`,
            { responseType: "arraybuffer" }
          );
          const returnedB64 = Buffer.from(downloadImage.data).toString(
            "base64"
          );

          thumbnail = returnedB64;
        } catch (error) {}

        res.send({
          title,
          thumbnail,
        });
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      await prisma.product.delete({
        where: { id: Number(id) },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
export default new ProductsController();
