const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');

const exposeFunctions = require('./exposeFunctions');
const { SOURCE_WEBSITE } = require('../constants');

const getWasteCollectionsData = async () => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await exposeFunctions(page);

  await page.goto(SOURCE_WEBSITE, { waitUntil: 'networkidle2' });

  const wasteCollectionsData = await page.evaluate(async () => {
    const wasteTitles = [...document.querySelectorAll('.waste-service-name')];
    const wasteDetails = [...document.querySelectorAll('.waste-service-name + div')];

    const wasteCollections = [];
    for (let i = 0; i < wasteTitles.length; i++) {
      const wasteType = wasteTitles[i].innerText;

      const nextCollectionDetails = await window.getNextWasteCollectionDetails(wasteDetails[i].innerText);

      if (!nextCollectionDetails) continue;

      const nextCollectionDate = await window.getNextCollectionDate(nextCollectionDetails);

      if (!nextCollectionDate) continue;

      wasteCollections.push({
        title: wasteType,
        nextCollectionDate,
      });
    }

    return wasteCollections;
  });

  await browser.close();

  return wasteCollectionsData;
};

module.exports = getWasteCollectionsData;
