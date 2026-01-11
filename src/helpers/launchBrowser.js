const { VERCEL, AWS_LAMBDA_FUNCTION_VERSION, AWS_EXECUTION_ENV } = require('../constants');

const isServerless = VERCEL === '1' || !!AWS_LAMBDA_FUNCTION_VERSION || !!AWS_EXECUTION_ENV;

async function launchBrowser() {
  // ✅ Local dev: use full puppeteer (bundles Chrome)
  if (!isServerless) {
    const puppeteer = require('puppeteer');
    return puppeteer.launch({
      headless: true,
    });
  }

  // ✅ Serverless (Vercel/Lambda): use puppeteer-core + Sparticuz Chromium (non-min)
  const puppeteer = require('puppeteer-core');
  const chromium = require('@sparticuz/chromium');

  // (Optional) helps in some serverless environments; harmless otherwise
  chromium.setHeadlessMode?.(true);
  chromium.setGraphicsMode?.(false);

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}

module.exports = { launchBrowser };
