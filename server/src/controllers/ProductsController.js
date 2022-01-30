const downloadFile = require("../utils/downloadFile");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ProductsController {
  async index(req, res, next) {
    try {
      const fetchProducts = await prisma.product.findMany({
        include: { _count: { select: { units: true } } },
        orderBy: { name: "asc" },
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

  async show(req, res, next) {
    try {
      const findProduct = await prisma.product.findFirst({
        where: { id: Number(req.params.id) },
        include: { units: true },
      });

      res.json({
        ...findProduct,
        units: findProduct.units.map((unit) => ({
          ...unit,
          expiration_date: new Intl.DateTimeFormat("pt-BR", {
            timeZone: "UTC",
          }).format(unit.expiration_date),
        })),
        thumb: `http://localhost:3333/public/thumb-${findProduct.natCode}.jpg`,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const createProduct = await prisma.product.create({ data: req.body });

      res.json(createProduct);
    } catch (error) {
      next(error);
    }
  }

  async patchBarCode(req, res, next) {
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
  async fetchByCode(req, res, next) {
    try {
      const code = req.params.code;

      try {
        let title;
        let imageUrl;

        try {
          const fetchPage = await axios.get(
            `https://commerce.natura.com.br/rest/api/get/product/detail/${code}`
          );
          title = fetchPage.data.title;
        } catch (error) {}

        try {
          await downloadFile(
            `https://images.rede.natura.net/image/sku/145x145/${code}_1.jpg`,
            `thumb-${code}.jpg`
          );

          imageUrl = `http://localhost:3333/public/thumb-${code}.jpg`;
        } catch (error) {}

        res.send({
          title,
          imageUrl,
        });
      } catch (error) {
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ProductsController();
