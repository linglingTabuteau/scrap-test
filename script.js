const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const iconv = require("iconv");

let allProducts = [];

for (let nbPage = 1; nbPage <= 24; nbPage++) {
  request.get(
    {
      url: `https://www.ultrajeux.com/cat.php?cat=3&jeu=0&page=${nbPage}`,
      encoding: null,
    },
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        // scrape encoding
        const ic = new iconv.Iconv("iso-8859-1", "utf-8");
        const buf = ic.convert(html);
        const utf8String = buf.toString("utf-8");

        console.log(utf8String);

        const $ = cheerio.load(utf8String);

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
          // console.log(allProducts.length);
          let dataJson = JSON.stringify(allProducts);
          fs.writeFileSync("myjsonfile.json", dataJson, "utf8", function (err) {
            if (err) throw err;
          });
        });
      }
    }
  );
}
