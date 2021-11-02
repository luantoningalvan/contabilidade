const conn = require("../db/conn");
const { formatMoney } = require("../utils/formatMoney");

class UnitsController {
  async index(req, res, next) {
    let filters = {};

    //   if (req.query.period) {
    //     .where('createdAt', '>=', '2009-01-01T00:00:00Z')
    // .where('createdAt', '<', '2010-01-01T00:00:00Z')
    //     console.log(new Date(req.query.period).getMonth());
    //     filters = { ...filters, "units.sale_date": req.query.status === "1" };

    //   }

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

  async show(req, res, next) {
    // try {
    //   const { id } = req.params;
    //   const findAlbum = await conn("albums")
    //     .select([
    //       "albums.*",
    //       "artists.id as artist_id",
    //       "artists.name as artist_name",
    //       "artists.avatar as artist_avatar",
    //     ])
    //     .innerJoin("artists", "albums.artist_id", "artists.id")
    //     .where("albums.id", id);
    //   console.log(findAlbum);
    //   if (!findAlbum) res.status(403).send({ error: "Album não encontrado" });
    //   const album = {
    //     id: findAlbum[0].id,
    //     name: findAlbum[0].name,
    //     cover: findAlbum[0].cover || defaultAlbumCover,
    //     artist: {
    //       id: findAlbum[0].artist_id,
    //       name: findAlbum[0].artist_name,
    //       avatar: findAlbum[0].artist_avatar || defaultAlbumCover,
    //     },
    //     musics: [],
    //   };
    //   findAlbum.forEach((currAlbum) => {
    //     if (currAlbum.music_id) {
    //       album.musics.push({
    //         id: currAlbum.music_id,
    //         title: currAlbum.originalname,
    //         filename: currAlbum.filename,
    //         duration: currAlbum.duration,
    //         url: `${process.env.BASE_URL}/public/${currAlbum.filename}`,
    //         cover: currAlbum.artist_avatar || defaultArtistCover,
    //         singer: currAlbum.artist_name,
    //       });
    //     }
    //   });
    //   res.json(album);
    // } catch (error) {
    //   next(error);
    // }
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

  async update(req, res, next) {
    // const data = req.body;
    // const { id: album_id } = req.params;
    // try {
    //   const updateAlbum = await conn("albums")
    //     .where({ id: album_id })
    //     .first()
    //     .update(data, "*");
    //   res.json(updateAlbum);
    // } catch (error) {
    //   next(error);
    // }
  }

  async remove(req, res, next) {
    // const { id: album_id } = req.params;
    // try {
    //   await conn("albums").where("id", album_id).first().del();
    //   res.json({ ok: true });
    // } catch (error) {
    //   next(error);
    // }
  }
}
module.exports = new UnitsController();
