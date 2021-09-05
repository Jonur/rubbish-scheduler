const dayjs = require('dayjs');

const { DATETIME_OPTIONS, USER_PREFERENCES } = require('../../constants');

const getExistingCalendarEvents = async (calendar, calendarEvents = []) => {
  const existingCalendarEvents = await calendar.events.list({
    calendarId: USER_PREFERENCES.CALENDAR_ID,
    timeZone: USER_PREFERENCES.TIMEZONE,
    timeMin: dayjs(calendarEvents[0]?.start?.dateTime, USER_PREFERENCES.TIMEZONE)
      .hour(DATETIME_OPTIONS.EVENT_START_TIME)
      .format(DATETIME_OPTIONS.FORMAT),
    timeMax: dayjs(calendarEvents[calendarEvents.length - 1]?.start?.dateTime, USER_PREFERENCES.TIMEZONE)
      .hour(DATETIME_OPTIONS.DAY_EOP)
      .format(DATETIME_OPTIONS.FORMAT),
  });

  return existingCalendarEvents;
};

module.exports = getExistingCalendarEvents;
