import { extractNextCollectionDate } from "./extractNextCollectionDate";
import getWasteCollectionsData from "./getWasteCollectionsData";
import launchBrowser from "./launchBrowser";

describe("getWasteCollectionsData", () => {
  const mockState = vi.hoisted(() => {
    let requestHandler: ((req: any) => void) | undefined;

    const mockedPage = {
      setDefaultTimeout: vi.fn(),
      setDefaultNavigationTimeout: vi.fn(),
      setRequestInterception: vi.fn(),
      on: vi.fn((event: string, handler: (req: any) => void) => {
        if (event === "request") requestHandler = handler;
      }),
      goto: vi.fn(),
      waitForSelector: vi.fn(),
      $$eval: vi.fn(),
    };

    const mockedBrowser = {
      newPage: vi.fn(async () => mockedPage),
      close: vi.fn(),
    };

    return {
      get requestHandler() {
        return requestHandler;
      },
      resetRequestHandler() {
        requestHandler = undefined;
      },
      mockedPage,
      mockedBrowser,
    };
  });

  vi.mock("../config", () => ({
    SOURCE_WEBSITE: "https://example.com/council-waste",
  }));

  vi.mock("./launchBrowser", () => ({
    default: vi.fn(),
  }));

  vi.mock("./extractNextCollectionDate", () => ({
    extractNextCollectionDate: vi.fn(),
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    mockState.resetRequestHandler();

    vi.mocked(launchBrowser).mockResolvedValue(mockState.mockedBrowser as any);

    // ✅ New $$eval shape: array of { title, detail }
    mockState.mockedPage.$$eval.mockResolvedValueOnce([
      { title: "Food Waste", detail: "detail-1" },
      { title: "Mixed Recycling", detail: "detail-2" },
      { title: "Garden Waste", detail: "detail-3" },
    ]);

    vi.mocked(extractNextCollectionDate).mockImplementation((detailText) => {
      switch (detailText) {
        case "detail-1":
          return "18 January 2026";
        case "detail-2":
          return ""; // filtered out
        case "detail-3":
          return "1 February 2026";
        default:
          return "";
      }
    });
  });

  it("scrapes items, parses next dates, and returns normalized waste collections", async () => {
    const result = await getWasteCollectionsData();

    expect(mockState.mockedBrowser.newPage).toHaveBeenCalledTimes(1);

    expect(mockState.mockedPage.setDefaultTimeout).toHaveBeenCalledWith(30_000);
    expect(mockState.mockedPage.setDefaultNavigationTimeout).toHaveBeenCalledWith(30_000);

    expect(mockState.mockedPage.setRequestInterception).toHaveBeenCalledWith(true);
    expect(mockState.mockedPage.on).toHaveBeenCalledWith("request", expect.any(Function));

    expect(mockState.mockedPage.goto).toHaveBeenCalledWith("https://example.com/council-waste", {
      waitUntil: "domcontentloaded",
    });

    expect(mockState.mockedPage.waitForSelector).toHaveBeenCalledWith(".waste-service-name");

    // ✅ New selector + single call
    expect(mockState.mockedPage.$$eval).toHaveBeenCalledTimes(1);
    expect(mockState.mockedPage.$$eval).toHaveBeenCalledWith(".waste-service-grid", expect.any(Function));

    expect(extractNextCollectionDate).toHaveBeenCalledTimes(3);

    expect(mockState.mockedBrowser.close).toHaveBeenCalledTimes(1);

    expect(result).toEqual([
      { title: "Food Waste", nextCollectionDate: "18 January 2026" },
      { title: "Garden Waste", nextCollectionDate: "1 February 2026" },
    ]);
  });

  it("aborts heavy request types and continues other requests", async () => {
    await getWasteCollectionsData();

    expect(mockState.requestHandler).toBeTypeOf("function");

    const createReq = (type: string) => {
      const abort = vi.fn().mockResolvedValue(undefined);
      const cont = vi.fn().mockResolvedValue(undefined);

      return {
        abort,
        continue: cont,
        resourceType: () => type,
      };
    };

    const imageReq = createReq("image");
    mockState.requestHandler?.(imageReq);
    expect(imageReq.abort).toHaveBeenCalledTimes(1);
    expect(imageReq.continue).not.toHaveBeenCalled();

    const fontReq = createReq("font");
    mockState.requestHandler?.(fontReq);
    expect(fontReq.abort).toHaveBeenCalledTimes(1);
    expect(fontReq.continue).not.toHaveBeenCalled();

    const stylesheetReq = createReq("stylesheet");
    mockState.requestHandler?.(stylesheetReq);
    expect(stylesheetReq.abort).toHaveBeenCalledTimes(1);
    expect(stylesheetReq.continue).not.toHaveBeenCalled();

    const mediaReq = createReq("media");
    mockState.requestHandler?.(mediaReq);
    expect(mediaReq.abort).toHaveBeenCalledTimes(1);
    expect(mediaReq.continue).not.toHaveBeenCalled();

    const scriptReq = createReq("script");
    mockState.requestHandler?.(scriptReq);
    expect(scriptReq.continue).toHaveBeenCalledTimes(1);
    expect(scriptReq.abort).not.toHaveBeenCalled();
  });
});
