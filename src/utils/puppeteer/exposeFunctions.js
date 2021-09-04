const getNextCollectionDate = require("../webScrapping/getNextCollectionDate");
const getNextWasteCollectionDetails = require("../webScrapping/getNextWasteCollectionDetails");

const exposeFunctions = async (page) => {
  await page.exposeFunction("getNextWasteCollectionDetails", (wasteDetails) =>
    getNextWasteCollectionDetails(wasteDetails)
  );
  await page.exposeFunction("getNextCollectionDate", (nextCollectionDetails) =>
    getNextCollectionDate(nextCollectionDetails)
  );
};

module.exports = exposeFunctions;
