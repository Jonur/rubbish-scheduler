import type { calendar_v3 } from "googleapis";

import { USER_PREFERENCES } from "../config";

const deleteExistingCalendarEvents = async (
  calendar: calendar_v3.Calendar,
  existingCalendarEvents: calendar_v3.Schema$Event[] = []
) => {
  for (const event of existingCalendarEvents) {
    if (event.id) {
      await calendar.events.delete({
        calendarId: USER_PREFERENCES.CALENDAR_ID,
        eventId: event.id,
      });
    }
  }
};

export default deleteExistingCalendarEvents;
