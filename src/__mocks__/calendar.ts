import type { calendar_v3 } from "googleapis";

export const createCalendarEvent = (overrides: Partial<calendar_v3.Schema$Event> = {}): calendar_v3.Schema$Event => ({
  id: "mocked-event",
  colorId: "6",
  description: "Waste collection of Food Waste & Mixed Recycling",
  end: {
    dateTime: "2026-01-18T10:00:00Z",
    timeZone: "Europe/London",
  },
  location: "Quernmore Cl, Bromley BR1 4EL",
  start: {
    dateTime: "2026-01-18T08:00:00Z",
    timeZone: "Europe/London",
  },
  summary: "Food Waste & Mixed Recycling",
  ...overrides,
});

export const createMockedCalendar = () => {
  const mockedEventsDelete = vi.fn();
  const mockedEventsInsert = vi.fn();
  const mockedEventsList = vi.fn();

  const mockedCalendar = {
    events: {
      delete: mockedEventsDelete,
      insert: mockedEventsInsert,
      list: mockedEventsList,
    },
  } as unknown as calendar_v3.Calendar;

  return {
    mockedCalendar,
    mockedEventsDelete,
    mockedEventsInsert,
    mockedEventsList,
  };
};
