import type { calendar_v3 } from "googleapis";

import dayjs from "./dayjs";
import { DATETIME_OPTIONS, USER_PREFERENCES } from "../config";

const getExistingCalendarEvents = async (
  calendar: calendar_v3.Calendar,
  calendarEvents: calendar_v3.Schema$Event[] = []
): Promise<calendar_v3.Schema$Event[]> => {
  if (!calendarEvents.length) return [];

  const first = calendarEvents[0]?.start?.dateTime;
  const last = calendarEvents[calendarEvents.length - 1]?.start?.dateTime;

  if (!first || !last) return [];

  const timeMin = dayjs(first)
    .tz(USER_PREFERENCES.TIMEZONE)
    .hour(DATETIME_OPTIONS.EVENT_START_TIME)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toISOString();

  const timeMax = dayjs(last)
    .tz(USER_PREFERENCES.TIMEZONE)
    .hour(DATETIME_OPTIONS.DAY_EOP)
    .minute(59)
    .second(59)
    .millisecond(999)
    .toISOString();

  if (!dayjs(timeMin).isValid() || !dayjs(timeMax).isValid()) {
    throw new Error(`Invalid time range: timeMin=${timeMin}, timeMax=${timeMax}`);
  }

  const res = await calendar.events.list({
    calendarId: USER_PREFERENCES.CALENDAR_ID,
    timeMin,
    timeMax,
    singleEvents: true, // important: expands recurring
    orderBy: "startTime", // required when singleEvents=true
  });

  return res?.data?.items || [];
};

export default getExistingCalendarEvents;
