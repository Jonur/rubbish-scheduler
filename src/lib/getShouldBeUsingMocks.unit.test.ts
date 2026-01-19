import { puppeteerResponseMock } from "../__mocks__";
import * as config from "../config";
import getShouldBeUsingMocks from "./getShouldBeUsingMocks";

describe("getShouldBeUsingMocks", () => {
  vi.mock("../config");
  const mockedConfig = vi.mocked(config);

  beforeEach(() => {
    mockedConfig.MOCK_SCRAPE = true;
  });

  it("should return the puppeteer mocked response when the user wants to run the app with mocks", () => {
    const result = getShouldBeUsingMocks();
    expect(result).toEqual(puppeteerResponseMock);
  });

  it("should return `null` when the user does not want to run the app with mocks", () => {
    mockedConfig.MOCK_SCRAPE = false;
    const result = getShouldBeUsingMocks();
    expect(result).toBeNull();
  });
});
