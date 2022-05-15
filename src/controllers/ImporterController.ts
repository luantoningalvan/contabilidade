import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import reader from "xlsx";

interface ExtactedUnitDTO {
  natCode: string;
  name: string;
  quantity: number;
  total_price: number;
  individual_price: number;
}

class ImporterController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const file = reader.read(req.body.file, {
        type: "base64",
      });

      let data: ExtactedUnitDTO[] = [];
      const cells = file.Sheets["Plan1"];
      let lastItemFound = false;

      while (!lastItemFound) {
        const currentItem = data.length + 29;

        const natCode = cells["A" + currentItem]?.v;
        const name = cells["B" + currentItem].v;
        const quantity = Number(cells["C" + currentItem].v);
        const total_price =
          cells["F" + currentItem].v !== "-"
            ? Number(cells["F" + currentItem].v)
            : 0;
        const individual_price = total_price / quantity;

        const item = {
          natCode,
          name,
          quantity,
          total_price,
          individual_price,
        };

        data.push(item);

        if (cells["A" + (currentItem + 1)]?.v == null) {
          lastItemFound = true;
        }
      }

      const foundExistingProducts = await prisma.product.findMany({
        where: {
          natCode: {
            in: data.map((item) => item.natCode),
          },
        },
      });

      const joinedData = data.map((item) => {
        const foundProduct = foundExistingProducts.find(
          (product) => product.natCode === item.natCode
        );

        if (foundProduct) {
          return {
            alreadyExists: true,
            id: foundProduct.id,
            name: foundProduct.name,
            quantity: item.quantity,
            total_price: item.total_price,
            individual_price: item.individual_price,
            natCode: item.natCode,
          };
        } else {
          return {
            alreadyExists: false,
            ...item,
          };
        }
      });

      res.send(joinedData);
    } catch (error) {
      next(error);
    }
  }
}
export default new ImporterController();
