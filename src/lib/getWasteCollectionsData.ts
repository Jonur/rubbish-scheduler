import { SOURCE_WEBSITE } from "../config";
import { WEBPAGE_DATA_SCRAPING_TIMEOUT_MS } from "../constants";
import type { WasteCollectionScrappedData } from "../types";
import { extractNextCollectionDate } from "./extractNextCollectionDate";
import extractWasteServiceGridData from "./extractWasteServiceGridData";
import launchBrowser from "./launchBrowser";

const getWasteCollectionsData = async (): Promise<WasteCollectionScrappedData[]> => {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  // ⏱ Reduce default timeouts
  page.setDefaultTimeout(WEBPAGE_DATA_SCRAPING_TIMEOUT_MS);
  page.setDefaultNavigationTimeout(WEBPAGE_DATA_SCRAPING_TIMEOUT_MS);

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

  // Some council/WAF setups return 503 to headless defaults.
  // These headers make the request look like a normal UK browser.
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-GB,en;q=0.9",
  });

  // 🚀 Load only what we need
  const response = await page.goto(SOURCE_WEBSITE, {
    waitUntil: "networkidle2",
  });

  const status = response?.status();
  if (!status || status >= 400) {
    await browser.close();
    throw new Error(`[scrape] HTTP ${status} at ${page.url()}`);
  }

  // Wait only for the data we care about
  await page.waitForSelector(".waste-service-name", { timeout: WEBPAGE_DATA_SCRAPING_TIMEOUT_MS });

  const items = await page.$$eval(".waste-service-grid", extractWasteServiceGridData);

  const wasteCollectionsData: WasteCollectionScrappedData[] = [];

  for (const { title, detail } of items) {
    const nextCollectionDate = extractNextCollectionDate(detail);
    if (!nextCollectionDate) continue;

    wasteCollectionsData.push({ title, nextCollectionDate });
  }

  await browser.close();

  return wasteCollectionsData;
};

export default getWasteCollectionsData;
