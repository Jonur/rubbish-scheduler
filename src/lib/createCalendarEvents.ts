import dayjs from "./dayjs";
import { DATETIME_OPTIONS, USER_PREFERENCES } from "../config";
import type { CalendarEvent, WasteCollectionScrappedData } from "../types";

const createCalendarEvents = (wasteCollectionsData: WasteCollectionScrappedData[] = []): CalendarEvent[] => {
  const mergedCollectionsOfSameDay = wasteCollectionsData.reduce<WasteCollectionScrappedData[]>((acc, collection) => {
    const idx = acc.findIndex((c) => c.nextCollectionDate === collection.nextCollectionDate);
    if (idx > -1) {
      acc[idx].title = `${acc[idx].title} & ${collection.title}`;
      return acc;
    }
    return [...acc, collection];
  }, []);

  const tz = USER_PREFERENCES.TIMEZONE;

  const calendarEvents = mergedCollectionsOfSameDay.map((collection) => {
    // Parse "3 January 2026" in Europe/London and produce ISO with correct offset
    const base = dayjs.tz(collection.nextCollectionDate, "D MMMM YYYY", tz);

    // ✅ ISO 8601 with correct offset (+00:00 or +01:00)
    const eventStartTime = base.hour(DATETIME_OPTIONS.EVENT_START_TIME).minute(0).second(0).millisecond(0).format();

    const eventEndTime = base.hour(DATETIME_OPTIONS.EVENT_END_TIME).minute(0).second(0).millisecond(0).format();

    return {
      colorId: USER_PREFERENCES.GOOGLE_CALENDAR_EVENT_COLOUR_ID,
      description: `Waste collection of ${collection.title}`,
      end: { dateTime: eventEndTime, timeZone: tz },
      location: USER_PREFERENCES.LOCATION,
      start: { dateTime: eventStartTime, timeZone: tz },
      summary: collection.title,
    } satisfies CalendarEvent;
  });

  return calendarEvents.sort((a, b) => (a.start.dateTime > b.start.dateTime ? 1 : -1));
};

export default createCalendarEvents;
