import { type calendar_v3, type Auth, google } from "googleapis";

import createCalendarEvents from "./createCalendarEvents";
import deleteExistingCalendarEvents from "./deleteExistingCalendarEvents";
import getExistingCalendarEvents from "./getExistingCalendarEvents";
import getShouldBeUsingMocks from "./getShouldBeUsingMocks";
import getWasteCollectionsData from "./getWasteCollectionsData";
import insertEventsIntoCalendar from "./insertEventsIntoCalendar";
import runWasteCollectionSync from "./runWasteCollectionSync";
import { existingCalendarEventsMock, puppeteerResponseMock } from "../__mocks__";
import type { CalendarEvent, WasteCollectionScrappedData } from "../types";

describe("runWasteCollectionSync", () => {
  vi.mock("googleapis", async (importOriginal) => ({
    ...(await importOriginal()),
    google: {
      auth: vi.fn(),
      calendar: vi.fn(),
    },
  }));
  vi.mock("./getOAuth2Client", () => ({
    default: vi.fn(() => ({ username: "Jonur" }) as unknown as Auth.JWT),
  }));
  vi.mock("./createCalendarEvents");
  vi.mock("./deleteExistingCalendarEvents");
  vi.mock("./getExistingCalendarEvents");
  vi.mock("./getShouldBeUsingMocks");
  vi.mock("./getWasteCollectionsData");
  vi.mock("./insertEventsIntoCalendar");

  const mockedCreateCalendarEvents = vi.mocked(createCalendarEvents);
  const mockedDeleteExistingCalendarEvents = vi.mocked(deleteExistingCalendarEvents);
  const mockedGetExistingCalendarEvents = vi.mocked(getExistingCalendarEvents);
  const mockedGetShouldBeUsingMocks = vi.mocked(getShouldBeUsingMocks);
  const mockedGetWasteCollectionsData = vi.mocked(getWasteCollectionsData);
  const mockedInsertEventsIntoCalendar = vi.mocked(insertEventsIntoCalendar);
  const mockedGoogle = vi.mocked(google);
  const mockedGoogleCalendar = vi.spyOn(mockedGoogle, "calendar");

  const mockedCalendar = {} as calendar_v3.Calendar;
  const mockedCalendarEvents: CalendarEvent[] = [
    {
      colorId: "6",
      summary: "Food Waste",
      description: "Waste collection of Food Waste",
      location: "Bromley",
      start: {
        dateTime: "2025-01-04T08:00:00.000Z",
        timeZone: "Europe/London",
      },
      end: {
        dateTime: "2025-01-04T10:00:00.000Z",
        timeZone: "Europe/London",
      },
    },
    {
      colorId: "6",
      summary: "Recycling & Garden Waste",
      description: "Waste collection of Recycling & Garden Waste",
      location: "Bromley",
      start: {
        dateTime: "2025-01-11T08:00:00.000Z",
        timeZone: "Europe/London",
      },
      end: {
        dateTime: "2025-01-11T10:00:00.000Z",
        timeZone: "Europe/London",
      },
    },
  ];

  beforeEach(() => {
    mockedCreateCalendarEvents.mockReturnValue([]);
    mockedDeleteExistingCalendarEvents.mockResolvedValue();
    mockedGetExistingCalendarEvents.mockResolvedValue([]);
    mockedGetShouldBeUsingMocks.mockReturnValue(null);
    mockedGetWasteCollectionsData.mockResolvedValue([]);
    mockedInsertEventsIntoCalendar.mockResolvedValue();
    mockedGoogleCalendar.mockReturnValue(mockedCalendar);
  });

  it("should authenticate the user on the google calendar app", async () => {
    await runWasteCollectionSync();

    expect(mockedGoogleCalendar).toHaveBeenCalledWith({
      auth: {
        username: "Jonur",
      },
      version: "v3",
    });
  });

  it("should create the calendar event from mocks if the user has chosen so", async () => {
    mockedGetShouldBeUsingMocks.mockReturnValue(puppeteerResponseMock);

    await runWasteCollectionSync();

    expect(mockedCreateCalendarEvents).toHaveBeenCalledWith(puppeteerResponseMock);
  });

  it("should create the calendar event from the fetched waste collection data by default", async () => {
    const mockedScrappedData: WasteCollectionScrappedData[] = [
      {
        title: "Food Waste",
        nextCollectionDate: "18 January 2026",
      },
      {
        title: "Paper & Cardboard",
        nextCollectionDate: "22 January 2026",
      },
    ];

    mockedGetWasteCollectionsData.mockResolvedValue(mockedScrappedData);

    await runWasteCollectionSync();

    expect(mockedCreateCalendarEvents).toHaveBeenCalledWith(mockedScrappedData);
  });

  it("should get the existing calendar events and delete the possibly incorrect matching ones and insert the new ones", async () => {
    mockedCreateCalendarEvents.mockReturnValue(mockedCalendarEvents);
    mockedGetExistingCalendarEvents.mockResolvedValue(existingCalendarEventsMock.data.items);

    await runWasteCollectionSync();

    expect(mockedGetExistingCalendarEvents).toHaveBeenCalledWith(mockedCalendar, mockedCalendarEvents);
    expect(mockedDeleteExistingCalendarEvents).toHaveBeenCalledWith(
      mockedCalendar,
      existingCalendarEventsMock.data.items
    );
    expect(mockedInsertEventsIntoCalendar).toHaveBeenCalledWith(mockedCalendar, mockedCalendarEvents);
  });

  it("should return the count of how many events were created and how many were deleted", async () => {
    mockedCreateCalendarEvents.mockReturnValue(mockedCalendarEvents);
    mockedGetExistingCalendarEvents.mockResolvedValue(existingCalendarEventsMock.data.items);

    const result = await runWasteCollectionSync();

    expect(result).toEqual({ created: 2, deleted: 3 });
  });
});
