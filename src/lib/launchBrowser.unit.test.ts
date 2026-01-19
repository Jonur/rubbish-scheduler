import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";

import launchBrowser from "./launchBrowser";
import * as config from "../config";

describe("launchBrowser", () => {
  vi.mock("puppeteer");
  vi.mock("puppeteer-core");
  vi.mock("@sparticuz/chromium", async (importOriginal) => ({
    ...(await importOriginal()),
    executablePath: vi.fn(),
    args: ["1"],
  }));
  vi.mock("../config");

  const mockedPuppeter = vi.mocked(puppeteer);
  const mockedPuppeterCore = vi.mocked(puppeteerCore);
  const mockedChromium = vi.mocked(chromium);
  const mockedConfig = vi.mocked(config);

  describe("when running locally", () => {
    const launchSpy = vi.spyOn(mockedPuppeter, "launch");

    beforeEach(() => {
      mockedConfig.IS_SERVERLESS = false;
    });

    it("should launch Puppeteer with only the headless option", async () => {
      await launchBrowser();
      expect(launchSpy).toHaveBeenCalledWith({ headless: true });
    });
  });

  describe("when running on the server", () => {
    const launchSpy = vi.spyOn(mockedPuppeterCore, "launch");
    const mockExecutableSpy = vi.fn();
    mockedChromium.executablePath = mockExecutableSpy;

    beforeEach(() => {
      mockedConfig.IS_SERVERLESS = true;
      mockExecutableSpy.mockReturnValue("mocked-path");
    });

    it("should launch Puppeteer with Chromium", async () => {
      await launchBrowser();
      expect(launchSpy).toHaveBeenCalledWith({
        headless: true,
        executablePath: "mocked-path",
        args: expect.arrayContaining(["--ignore-certificate-errors"]),
      });
    });
  });
});
