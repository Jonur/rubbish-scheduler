import type { calendar_v3 } from "googleapis";

import { USER_PREFERENCES } from "../config";
import logger from "./logger";

const insertEventsIntoCalendar = async (
  calendar: calendar_v3.Calendar,
  calendarEvents: calendar_v3.Schema$Event[] = []
) => {
  for (const event of calendarEvents) {
    await calendar.events.insert({
      calendarId: USER_PREFERENCES.CALENDAR_ID,
      requestBody: event,
    });
  }

  logger(`Inserted ${calendarEvents.length} events`);
};

export default insertEventsIntoCalendar;
