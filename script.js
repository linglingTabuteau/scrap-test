const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

let allProducts = [];

for (let nbPage = 1; nbPage <= 24; nbPage++) {
  request(
    `https://www.ultrajeux.com/cat.php?cat=3&jeu=0&page=${nbPage}`,
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let oneObject = {};
        $("#container_droite .block_produit").each((index, el) => {
          const link = $(el).find("a").attr("href");
          const title = $(el).find(".titre").text();
          const prix = $(el).find(".prix").find(".prix").text();
          const reduction = $(el).find(".titre_pourcent").text().split(" ")[1];
          const image = $(el)
            .find(".image")
            .find("a")
            .children("img")
            .attr("src");

          oneObject = reduction
            ? {
                url: `https://www.ultrajeux.com/${link}`,
                name: title,
                price: prix,
                urlImage: image,
                promotion: reduction,
              }
            : {
                url: `https://www.ultrajeux.com/${link}`,
                name: title,
                price: prix,
                urlImage: image,
              };
          allProducts.push(oneObject);
          console.log(allProducts.length);
          let dataJson = JSON.stringify(allProducts);
          fs.writeFileSync("myjsonfile.json", dataJson, "utf8", function (err) {
            if (err) throw err;
          });
        });
      }
    }
  );
}
