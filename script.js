const request = require("request");
const cheerio = require("cheerio");

request(
  "https://www.ultrajeux.com/cat-3-jeux-de-societe.html",
  (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      let oneObject = {};

      $(".contenu").each((index, el) => {
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
        let dataJson = JSON.stringify(oneObject);
        console.log(dataJson);
      });
    }
  }
);
