const conn = require("../db/conn");

class CategoriesController {
  async index(req, res, next) {
    try {
      const fetchCategories = await conn.select("*").from("categories");

      res.json(fetchCategories);
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
      const createCategory = await conn("categories").insert(
        {
          name: data.name,
          color: data.color,
        },
        ["*"]
      );

      res.json(createCategory[0]);
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
module.exports = new CategoriesController();
