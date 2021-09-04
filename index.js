const puppeteer = require("puppeteer");
const { exposeFunctions } = require("./src/utils");
const { SOURCE_WEBSITE } = require("./src/constants");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on("console", (msg) => console.log(msg.text()));
  await exposeFunctions(page);

  await page.goto(SOURCE_WEBSITE, { waitUntil: "networkidle2" });

  const data = await page.evaluate(async () => {
    const wasteTitles = [...document.querySelectorAll(".waste-service-name")];
    const wasteDetails = [
      ...document.querySelectorAll(".waste-service-name + div"),
    ];

    console.log(wasteTitles.length, wasteDetails.length);

    const wasteData = [];
    for (let i = 0; i < wasteTitles.length; i++) {
      const wasteType = wasteTitles[i].innerText;

      const nextCollectionDetails = await window.getNextWasteCollectionDetails(
        wasteDetails[i].innerText
      );

      if (!nextCollectionDetails) continue;

      const nextCollectionDate = await window.getNextCollectionDate(
        nextCollectionDetails
      );

      if (!nextCollectionDate) continue;

      wasteData.push({
        title: wasteType,
        nextCollectionDate,
      });
    }

    return wasteData;
  });

  console.log(data);

  await browser.close();
})();
