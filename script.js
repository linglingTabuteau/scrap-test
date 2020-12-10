// const request = require("request");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const iconv = require("iconv");

let allProducts = [];

const scrapper = async () => {
  for (let nbPage = 1; nbPage <= 24; nbPage++) {
    console.log(nbPage);
    let response = await fetch(
      `https://www.ultrajeux.com/cat.php?cat=3&jeu=0&page=${nbPage}`
    );
    // let data = await response.json() why not json???
    let data = await response.text();

    const $ = cheerio.load(data);

    $("#container_droite .block_produit").each((index, el) => {
      const oneProduct = {
        link: $(el).find("a").attr("href"),
        title: $(el).find(".titre").text(),
        prix: $(el).find(".prix").find(".prix").text(),
        // reduction: $(el).find(".titre_pourcent").text().split(" ")[1],
        image: $(el).find(".image").find("a").children("img").attr("src"),
      };

      let reduction = $(el).find(".titre_pourcent").text().split(" ")[1];
      let result = reduction
        ? (oneProduct["promotion"] = reduction)
        : oneProduct;

      allProducts.push(oneProduct);
      console.log(oneProduct);
    });
  }
  let dataJson = JSON.stringify(allProducts);
  fs.writeFileSync("myFile.json", dataJson);
};

scrapper();
