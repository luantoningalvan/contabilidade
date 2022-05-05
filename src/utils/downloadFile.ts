import fs from "fs";
import path from "path";
import https from "https";

const downloadFile = async (url: string, name: string) =>
  new Promise((resolve, reject) => {
    try {
      const file = fs.createWriteStream(
        path.join(__dirname, "..", "..", "uploads", name)
      );
      https.get(url, function (response) {
        response.pipe(file).on("finish", resolve);
      });
    } catch (error) {
      console.error(`Erro ao baixar ${name}`, error);
      reject(error);
    }
  });

export default downloadFile;
