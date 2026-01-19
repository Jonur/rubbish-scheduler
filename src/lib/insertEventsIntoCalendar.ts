import type { calendar_v3 } from "googleapis";

import { USER_PREFERENCES } from "../config";
import type { CalendarEvent } from "../types";

const insertEventsIntoCalendar = async (calendar: calendar_v3.Calendar, calendarEvents: CalendarEvent[] = []) => {
  for (const event of calendarEvents) {
    await calendar.events.insert({
      calendarId: USER_PREFERENCES.CALENDAR_ID,
      requestBody: event,
    });
  }

  console.log(`Inserted ${calendarEvents.length} events`);
};

export default insertEventsIntoCalendar;
