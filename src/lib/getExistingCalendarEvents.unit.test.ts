import type { calendar_v3 } from "googleapis";

import { createCalendarEvent, createMockedCalendar } from "../__mocks__";
import getExistingCalendarEvents from "./getExistingCalendarEvents";

describe("getExistingCalendarEvents", () => {
  // --- hoisted dayjs mock state + implementation ---
  const dayjsState = vi.hoisted(() => {
    /**
     * We need two behaviours:
     * 1) dayjs(first/last).tz(...).hour(...).minute(...).second(...).millisecond(...).toISOString()
     * 2) dayjs(timeMin/timeMax).isValid()
     *
     * We'll:
     * - return a chain object for "dateTime inputs"
     * - return { isValid } for "timeMin/timeMax inputs"
     */
    let timeMinIso = "2025-01-04T08:00:00.000Z";
    let timeMaxIso = "2025-01-11T18:59:59.999Z";

    let isValidTimeMin = true;
    let isValidTimeMax = true;

    const chain = {
      tz: vi.fn(() => chain),
      hour: vi.fn(() => chain),
      minute: vi.fn(() => chain),
      second: vi.fn(() => chain),
      millisecond: vi.fn(() => chain),
      toISOString: vi.fn(() => ""),
    };

    const dayjsMock = vi.fn((input?: string) => {
      // Validation calls: dayjs(timeMin).isValid(), dayjs(timeMax).isValid()
      if (input === timeMinIso) return { isValid: () => isValidTimeMin };
      if (input === timeMaxIso) return { isValid: () => isValidTimeMax };

      // For building timeMin/timeMax from first/last: return chain
      // We'll switch what toISOString returns based on whether input equals first/last
      chain.toISOString.mockImplementation(() => {
        // default; overridden in tests via setters
        return input?.includes("2025-01-04") ? timeMinIso : timeMaxIso;
      });

      return chain;
    });

    return {
      // setters for tests
      setTimeMinIso(v: string) {
        timeMinIso = v;
      },
      setTimeMaxIso(v: string) {
        timeMaxIso = v;
      },
      setValid(minValid: boolean, maxValid: boolean) {
        isValidTimeMin = minValid;
        isValidTimeMax = maxValid;
      },

      // access for assertions
      chain,
      dayjsMock,
      get timeMinIso() {
        return timeMinIso;
      },
      get timeMaxIso() {
        return timeMaxIso;
      },
    };
  });

  // mock config so we can assert calls without depending on real env
  vi.mock("../config", () => ({
    USER_PREFERENCES: {
      TIMEZONE: "Europe/London",
      CALENDAR_ID: "mocked-calendar-id",
    },
    DATETIME_OPTIONS: {
      EVENT_START_TIME: 8,
      DAY_EOP: 18,
    },
  }));

  // mock dayjs wrapper
  vi.mock("./dayjs", () => ({
    default: dayjsState.dayjsMock,
  }));

  beforeEach(() => {
    vi.clearAllMocks();

    // IMPORTANT: do not collide with any real event start.dateTime strings
    dayjsState.setTimeMinIso("__TIME_MIN__");
    dayjsState.setTimeMaxIso("__TIME_MAX__");

    dayjsState.setValid(true, true);
  });

  const mockedCalendarEvents: calendar_v3.Schema$Event[] = [
    createCalendarEvent({
      summary: "Food Waste",
      description: "Waste collection of Food Waste",
      start: { dateTime: "2025-01-04T08:00:00.000Z", timeZone: "Europe/London" },
      end: { dateTime: "2025-01-04T10:00:00.000Z", timeZone: "Europe/London" },
    }),
    createCalendarEvent({
      summary: "Recycling & Garden Waste",
      description: "Waste collection of Recycling & Garden Waste",
      start: { dateTime: "2025-01-11T08:00:00.000Z", timeZone: "Europe/London" },
      end: { dateTime: "2025-01-11T10:00:00.000Z", timeZone: "Europe/London" },
    }),
  ];

  it("should return an empty array when calendarEvents is empty", async () => {
    const { mockedCalendar, mockedEventsList } = createMockedCalendar();

    const result = await getExistingCalendarEvents(mockedCalendar, []);

    expect(result).toEqual([]);
    expect(mockedEventsList).not.toHaveBeenCalled();
  });

  it("should return an empty array when the first event has no start.dateTime", async () => {
    const { mockedCalendar, mockedEventsList } = createMockedCalendar();

    const events = [
      createCalendarEvent({ start: { dateTime: undefined, timeZone: "Europe/London" } }),
      ...mockedCalendarEvents.slice(1),
    ];

    const result = await getExistingCalendarEvents(mockedCalendar, events);

    expect(result).toEqual([]);
    expect(mockedEventsList).not.toHaveBeenCalled();
  });

  it("should return an empty array when the last event has no start.dateTime", async () => {
    const { mockedCalendar, mockedEventsList } = createMockedCalendar();

    const events = [
      ...mockedCalendarEvents.slice(0, 1),
      createCalendarEvent({ start: { dateTime: undefined, timeZone: "Europe/London" } }),
    ];

    const result = await getExistingCalendarEvents(mockedCalendar, events);

    expect(result).toEqual([]);
    expect(mockedEventsList).not.toHaveBeenCalled();
  });

  it("should throw when the computed time range is invalid", async () => {
    const { mockedCalendar, mockedEventsList } = createMockedCalendar();

    // Make validation fail
    dayjsState.setValid(false, true);

    await expect(getExistingCalendarEvents(mockedCalendar, mockedCalendarEvents)).rejects.toThrow(/Invalid time range/);

    expect(mockedEventsList).not.toHaveBeenCalled();
  });

  it("should call calendar.events.list with the computed timeMin/timeMax and returns items", async () => {
    const { mockedCalendar, mockedEventsList } = createMockedCalendar();

    const existingItems: calendar_v3.Schema$Event[] = [
      createCalendarEvent({ id: "existing-1", summary: "Existing event 1" }),
      createCalendarEvent({ id: "existing-2", summary: "Existing event 2" }),
    ];

    mockedEventsList.mockResolvedValue({
      data: { items: existingItems },
    } as unknown as Awaited<ReturnType<calendar_v3.Calendar["events"]["list"]>>);

    const result = await getExistingCalendarEvents(mockedCalendar, mockedCalendarEvents);

    // returned items
    expect(result).toEqual(existingItems);

    // called with correct shape
    expect(mockedEventsList).toHaveBeenCalledWith({
      calendarId: "mocked-calendar-id",
      timeMin: dayjsState.timeMinIso,
      timeMax: dayjsState.timeMaxIso,
      singleEvents: true,
      orderBy: "startTime",
    });

    // sanity: ensures we exercised the dayjs chain at least once
    expect(dayjsState.chain.tz).toHaveBeenCalledWith("Europe/London");
  });

  it("should return an empty array when calendar.events.list returns no items", async () => {
    const { mockedCalendar, mockedEventsList } = createMockedCalendar();

    mockedEventsList.mockResolvedValue({
      data: {},
    } as unknown as Awaited<ReturnType<calendar_v3.Calendar["events"]["list"]>>);

    const result = await getExistingCalendarEvents(mockedCalendar, mockedCalendarEvents);

    expect(result).toEqual([]);
  });
});
