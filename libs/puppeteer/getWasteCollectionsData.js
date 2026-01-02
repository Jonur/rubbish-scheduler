const launchBrowser = require('./launchBrowser');
const { extractNextCollectionDate } = require('../webScrapping/extractNextCollectionDate');
const { SOURCE_WEBSITE } = require('../constants');

const getWasteCollectionsData = async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  await page.goto(SOURCE_WEBSITE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.waste-service-name', { timeout: 30_000 });

  const titles = await page.$$eval('.waste-service-name', (els) => els.map((e) => (e.textContent || '').trim()));
  const details = await page.$$eval('.waste-service-name + div', (els) => els.map((e) => (e.textContent || '').trim()));

  const wasteCollectionsData = [];
  for (let i = 0; i < titles.length; i++) {
    const nextCollectionDate = extractNextCollectionDate(details[i]);
    if (!nextCollectionDate) continue;

    wasteCollectionsData.push({
      title: titles[i],
      nextCollectionDate,
    });
  }

  await browser.close();

  return wasteCollectionsData;
};

module.exports = getWasteCollectionsData;
