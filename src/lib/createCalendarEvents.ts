import type { calendar_v3 } from "googleapis";

import dayjs from "./dayjs";
import { DATETIME_OPTIONS, USER_PREFERENCES } from "../config";
import type { WasteCollectionScrappedData } from "../types";
import mergeCollectionsOfSameDay from "./mergeCollectionsOfSameDay";

const createCalendarEvents = (wasteCollectionsData: WasteCollectionScrappedData[] = []): calendar_v3.Schema$Event[] => {
  const mergedCollectionsOfSameDay = mergeCollectionsOfSameDay(wasteCollectionsData);

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
    } satisfies calendar_v3.Schema$Event;
  });

  return calendarEvents.sort((a, b) => (a.start.dateTime > b.start.dateTime ? 1 : -1));
};

export default createCalendarEvents;
