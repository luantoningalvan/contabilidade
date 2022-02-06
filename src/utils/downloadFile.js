const fs = require("fs");
const path = require("path");
const https = require("https");

const downloadFile = async (url, name) =>
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

module.exports = downloadFile;
