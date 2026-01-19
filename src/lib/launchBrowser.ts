import { IS_SERVERLESS } from "../config";

const launchBrowser = async () => {
  if (!IS_SERVERLESS) {
    const { default: puppeteer } = await import("puppeteer");
    return puppeteer.launch({ headless: true });
  }

  const { default: puppeteer } = await import("puppeteer-core");
  const { default: chromium } = await import("@sparticuz/chromium");

  return puppeteer.launch({
    args: [...chromium.args, "--ignore-certificate-errors"],
    executablePath: await chromium.executablePath(),
    headless: true,
  });
};

export default launchBrowser;
