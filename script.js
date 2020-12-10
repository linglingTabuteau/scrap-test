const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const iconv = require("iconv-lite");

const allProducts = [];
(async () => {
  for (let nbPage = 1; nbPage <= 24; nbPage++) {
    console.log(nbPage);
    const response = await fetch(
      `https://www.ultrajeux.com/cat.php?cat=3&jeu=0&page=${nbPage}`
    );

    const buffer = await response.buffer();
    const data = iconv.decode(buffer, "ISO-8859-1");

    const $ = cheerio.load(data);

    $("#container_droite .block_produit").each((index, el) => {
      const oneProduct = {
        link: $(el).find("a").attr("href"),
        title: $(el).find(".titre").text(),
        prix: $(el).find(".prix").find(".prix").text(),
        image: $(el).find(".image").find("a").children("img").attr("src"),
      };

      let reduction = $(el).find(".titre_pourcent").text().split(" ")[1];
      reduction ? (oneProduct["promotion"] = reduction) : oneProduct;

      allProducts.push(oneProduct);
    });
  }

  let dataJson = JSON.stringify(allProducts);
  fs.writeFileSync("myjsonfile.json", dataJson);
})();
