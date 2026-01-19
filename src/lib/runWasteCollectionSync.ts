import { google } from "googleapis";

import createCalendarEvents from "./createCalendarEvents";
import deleteExistingCalendarEvents from "./deleteExistingCalendarEvents";
import getExistingCalendarEvents from "./getExistingCalendarEvents";
import getOAuth2Client from "./getOAuth2Client";
import getShouldBeUsingMocks from "./getShouldBeUsingMocks";
import getWasteCollectionsData from "./getWasteCollectionsData";
import insertEventsIntoCalendar from "./insertEventsIntoCalendar";

const runWasteCollectionSync = async () => {
  const calendar = google.calendar({ version: "v3", auth: getOAuth2Client() });

  const wasteCollectionsData = getShouldBeUsingMocks() || (await getWasteCollectionsData());
  const calendarEvents = createCalendarEvents(wasteCollectionsData);

  const existingCalendarEvents = await getExistingCalendarEvents(calendar, calendarEvents);
  await deleteExistingCalendarEvents(calendar, existingCalendarEvents);

  await insertEventsIntoCalendar(calendar, calendarEvents);

  return {
    created: calendarEvents.length,
    deleted: existingCalendarEvents.length,
  };
};

export default runWasteCollectionSync;
