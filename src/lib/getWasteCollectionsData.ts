import { SOURCE_WEBSITE } from "../config";
import type { WasteCollectionScrappedData } from "../types";
import { extractNextCollectionDate } from "./extractNextCollectionDate";
import getTextContent from "./getTextContent";
import launchBrowser from "./launchBrowser";

const getWasteCollectionsData = async (): Promise<WasteCollectionScrappedData[]> => {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  // ⏱ Reduce default timeouts
  page.setDefaultTimeout(30_000);
  page.setDefaultNavigationTimeout(30_000);

  // 🚫 Block unnecessary resources (big speed win on serverless)
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const type = req.resourceType();

    if (type === "image" || type === "font" || type === "stylesheet" || type === "media") {
      req.abort().catch(console.error);
    } else {
      req.continue().catch(console.error);
    }
  });

  // 🚀 Load only what we need
  await page.goto(SOURCE_WEBSITE, {
    waitUntil: "domcontentloaded",
  });

  // Wait only for the data we care about
  await page.waitForSelector(".waste-service-name");

  const titles = await page.$$eval(".waste-service-name", getTextContent);

  const details = await page.$$eval(".waste-service-name + div", getTextContent);

  const wasteCollectionsData: WasteCollectionScrappedData[] = [];

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

export default getWasteCollectionsData;
