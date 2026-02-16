import ical from "ical";

import getWasteCollectionsDataFromIcs from "./getWasteCollectionsDataFromIcs";

describe("getWasteCollectionsDataFromIcs", () => {
  vi.mock("ical", () => ({
    default: {
      parseICS: vi.fn(),
    },
  }));

  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches the ICS, parses it, and returns the next upcoming date per title", async () => {
    const webcalUrl = "webcal://recyclingservices.bromley.gov.uk/waste/6324915/calendar.ics";
    const httpsUrl = "https://recyclingservices.bromley.gov.uk/waste/6324915/calendar.ics";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue("BEGIN:VCALENDAR..."),
    });

    vi.mocked(ical.parseICS).mockReturnValueOnce({
      meta: { type: "VCALENDAR" },

      // Past event ignored
      past: {
        type: "VEVENT",
        summary: "Food Waste",
        start: new Date("2000-01-01T00:00:00Z"),
      },

      // ✅ summary trims to empty => ignored (covers line 35 path)
      whitespaceSummary: {
        type: "VEVENT",
        summary: "   ",
        start: new Date("2099-04-01T00:00:00Z"),
      },

      // ✅ same title, ordered to hit both replacement branches (covers line 45)
      foodSetFirst: {
        type: "VEVENT",
        summary: "Food Waste",
        start: new Date("2099-02-01T00:00:00Z"),
      },
      foodLater: {
        type: "VEVENT",
        summary: "Food Waste",
        start: new Date("2099-03-01T00:00:00Z"),
      },
      foodEarlier: {
        type: "VEVENT",
        summary: "Food Waste",
        start: new Date("2099-01-01T00:00:00Z"),
      },

      garden: {
        type: "VEVENT",
        summary: "Garden Waste",
        start: new Date("2099-03-01T00:00:00Z"),
      },

      // Missing fields ignored
      broken: {
        type: "VEVENT",
        summary: "",
        start: undefined,
      },
      noSummary: {
        type: "VEVENT",
        start: new Date("2099-05-01T00:00:00Z"),
      },
    } as any);

    const result = await getWasteCollectionsDataFromIcs(webcalUrl);

    expect(mockFetch).toHaveBeenCalledWith(httpsUrl, {
      headers: {
        "Accept-Language": "en-GB,en;q=0.9",
        Accept: "text/calendar,*/*;q=0.9",
      },
    });

    expect(ical.parseICS).toHaveBeenCalledWith("BEGIN:VCALENDAR...");

    expect(result.sort((a, b) => a.title.localeCompare(b.title))).toEqual([
      { title: "Food Waste", nextCollectionDate: "1 January 2099" },
      { title: "Garden Waste", nextCollectionDate: "1 March 2099" },
    ]);
  });

  it("throws a helpful error when the ICS fetch fails", async () => {
    const webcalUrl = "webcal://recyclingservices.bromley.gov.uk/waste/6324915/calendar.ics";
    const httpsUrl = "https://recyclingservices.bromley.gov.uk/waste/6324915/calendar.ics";

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: vi.fn(),
    });

    await expect(getWasteCollectionsDataFromIcs(webcalUrl)).rejects.toThrow(`[ics] HTTP 503 at ${httpsUrl}`);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(ical.parseICS).not.toHaveBeenCalled();
  });
});
