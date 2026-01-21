import type { calendar_v3 } from "googleapis";

import * as config from "../config";
import insertEventsIntoCalendar from "./insertEventsIntoCalendar";
import logger from "./logger";
import { createMockedCalendar } from "../__mocks__";

describe("insertEventsIntoCalendar", () => {
  vi.mock("./logger");
  vi.mock("../config");

  const mockedConfig = vi.mocked(config);
  const mockedLogger = vi.mocked(logger);

  const { mockedCalendar, mockedEventsInsert } = createMockedCalendar();

  const mockedCalendarEvents: calendar_v3.Schema$Event[] = [
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
    mockedConfig.USER_PREFERENCES.CALENDAR_ID = "mocked-jonur-calendar";
  });

  it("should insert two events into the calendar", async () => {
    await insertEventsIntoCalendar(mockedCalendar, mockedCalendarEvents);
    expect(mockedEventsInsert).toHaveBeenCalledTimes(2);
  });

  it("should insert the events to the correct calendar", async () => {
    await insertEventsIntoCalendar(mockedCalendar, mockedCalendarEvents);

    expect(mockedEventsInsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        calendarId: "mocked-jonur-calendar",
      })
    );
    expect(mockedEventsInsert).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        calendarId: "mocked-jonur-calendar",
      })
    );
  });

  it("should log the number of created events", async () => {
    await insertEventsIntoCalendar(mockedCalendar, mockedCalendarEvents);
    expect(mockedLogger).toHaveBeenCalledWith("Inserted 2 events");
  });
});
