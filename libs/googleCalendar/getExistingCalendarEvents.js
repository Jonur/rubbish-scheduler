const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const { DATETIME_OPTIONS, USER_PREFERENCES } = require('../constants');

const getExistingCalendarEvents = async (calendar, calendarEvents = []) => {
  if (!calendarEvents.length) return { data: { items: [] } };

  const first = calendarEvents[0]?.start?.dateTime;
  const last = calendarEvents[calendarEvents.length - 1]?.start?.dateTime;

  if (!first || !last) return { data: { items: [] } };

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
    orderBy: 'startTime', // required when singleEvents=true
  });

  return res;
};

module.exports = getExistingCalendarEvents;
