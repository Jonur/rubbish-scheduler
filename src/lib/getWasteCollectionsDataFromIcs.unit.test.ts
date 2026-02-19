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

  it("fetches the ICS, parses it, returns all future events, normalizes titles, de-dupes and sorts", async () => {
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
        summary: "Food Waste collection",
        start: new Date("2000-01-01T00:00:00Z"),
      },

      // summary trims to empty => ignored
      whitespaceSummary: {
        type: "VEVENT",
        summary: "   ",
        start: new Date("2099-04-01T00:00:00Z"),
      },

      // No summary => ignored
      noSummary: {
        type: "VEVENT",
        start: new Date("2099-05-01T00:00:00Z"),
      },

      // Missing start => ignored
      noStart: {
        type: "VEVENT",
        summary: "Garden Waste collection",
        start: undefined,
      },

      // ✅ Future events (should all be returned)
      // Also checks title normalization:
      // - collapses whitespace
      // - strips trailing " collection"
      food1: {
        type: "VEVENT",
        summary: "Food   Waste   collection",
        start: new Date("2099-01-01T00:00:00Z"),
      },
      food2: {
        type: "VEVENT",
        summary: "Food Waste collection",
        start: new Date("2099-02-01T00:00:00Z"),
      },

      garden1: {
        type: "VEVENT",
        summary: "Garden Waste collection",
        start: new Date("2099-01-15T00:00:00Z"),
      },

      // ✅ Duplicate event (same normalized title + same date) should be ignored
      gardenDuplicate: {
        type: "VEVENT",
        summary: "  Garden   Waste   collection  ",
        start: new Date("2099-01-15T00:00:00Z"),
      },

      // Non-event ignored
      timezone: {
        type: "VTIMEZONE",
      },
    } as any);

    const result = await getWasteCollectionsDataFromIcs(webcalUrl);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(httpsUrl, {
      headers: {
        "Accept-Language": "en-GB,en;q=0.9",
        Accept: "text/calendar,*/*;q=0.9",
      },
    });

    expect(ical.parseICS).toHaveBeenCalledTimes(1);
    expect(ical.parseICS).toHaveBeenCalledWith("BEGIN:VCALENDAR...");

    // ✅ Should return all FUTURE events, normalized + deduped + sorted by date then title.
    expect(result).toEqual([
      { title: "Food Waste", nextCollectionDate: "1 January 2099" },
      { title: "Garden Waste", nextCollectionDate: "15 January 2099" },
      { title: "Food Waste", nextCollectionDate: "1 February 2099" },
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

  it("sorts by title when two events have the same collection date", async () => {
    const webcalUrl = "webcal://recyclingservices.bromley.gov.uk/waste/6324915/calendar.ics";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue("BEGIN:VCALENDAR..."),
    });

    // Same date, different titles -> should sort alphabetically by title
    vi.mocked(ical.parseICS).mockReturnValueOnce({
      a: {
        type: "VEVENT",
        summary: "Garden Waste collection",
        start: new Date("2099-01-01T00:00:00Z"),
      },
      b: {
        type: "VEVENT",
        summary: "Food Waste collection",
        start: new Date("2099-01-01T00:00:00Z"),
      },
    } as any);

    const result = await getWasteCollectionsDataFromIcs(webcalUrl);

    expect(result).toEqual([
      { title: "Food Waste", nextCollectionDate: "1 January 2099" },
      { title: "Garden Waste", nextCollectionDate: "1 January 2099" },
    ]);
  });
});
