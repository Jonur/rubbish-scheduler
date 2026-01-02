const isServerless =
  !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_VERSION || !!process.env.AWS_EXECUTION_ENV;

async function launchBrowser() {
  if (!isServerless) {
    // ✅ Local Mac / dev
    const puppeteer = require('puppeteer');
    return puppeteer.launch({
      headless: true,
    });
  }

  // ✅ Vercel / serverless
  const puppeteer = require('puppeteer-core');
  const chromium = require('@sparticuz/chromium-min');

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
}

module.exports = launchBrowser;
