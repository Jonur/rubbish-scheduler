import { google } from "googleapis";

import createCalendarEvents from "./createCalendarEvents";
import deleteExistingCalendarEvents from "./deleteExistingCalendarEvents";
import getExistingCalendarEvents from "./getExistingCalendarEvents";
import getOAuth2Client from "./getOAuth2Client";
import getShouldBeUsingMocks from "./getShouldBeUsingMocks";
import getWasteCollectionsDataFromIcs from "./getWasteCollectionsDataFromIcs";
import insertEventsIntoCalendar from "./insertEventsIntoCalendar";
import { ICS_URL } from "../constants";

const runWasteCollectionSync = async () => {
  const wasteCollectionsData = getShouldBeUsingMocks() || (await getWasteCollectionsDataFromIcs(ICS_URL));

  if (wasteCollectionsData.length === 0) {
    throw new Error("No waste collection data found to process.");
  }

  const calendarEvents = createCalendarEvents(wasteCollectionsData);

  const calendar = google.calendar({ version: "v3", auth: getOAuth2Client() });

  const existingCalendarEvents = await getExistingCalendarEvents(calendar, calendarEvents);
  await deleteExistingCalendarEvents(calendar, existingCalendarEvents);

  await insertEventsIntoCalendar(calendar, calendarEvents);

  return {
    created: calendarEvents.length,
    deleted: existingCalendarEvents.length,
  };
};

export default runWasteCollectionSync;
