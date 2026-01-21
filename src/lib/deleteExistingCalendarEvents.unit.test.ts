import deleteExistingCalendarEvents from "./deleteExistingCalendarEvents";
import { createCalendarEvent, createMockedCalendar } from "../__mocks__";

describe("deleteExistingCalendarEvents", () => {
  const { mockedCalendar, mockedEventsDelete } = createMockedCalendar();

  it("should dispatch to delete all existing events from the calendar", async () => {
    const mockedEvents = [
      createCalendarEvent({ id: "event-1" }),
      createCalendarEvent({ id: "event-2" }),
      createCalendarEvent({ id: "event-3" }),
    ];

    await deleteExistingCalendarEvents(mockedCalendar, mockedEvents);

    expect(mockedEventsDelete).toHaveBeenCalledTimes(3);
  });

  it("should not attempt to delete an event without a valid id", async () => {
    const mockedEvents = [
      createCalendarEvent({ id: "event-1" }),
      createCalendarEvent({ id: undefined }),
      createCalendarEvent({ id: "event-2" }),
    ];

    await deleteExistingCalendarEvents(mockedCalendar, mockedEvents);

    expect(mockedEventsDelete).toHaveBeenCalledTimes(2);
  });
});
