const { USER_PREFERENCES } = require('../constants');

const deleteExistingCalendarEvents = async (auth, calendar, existingCalendarEvents) => {
  const events = existingCalendarEvents?.data?.items || [];

  for (const event of events) {
    await calendar.events.delete({
      auth,
      calendarId: USER_PREFERENCES.CALENDAR_ID,
      eventId: event.id,
    });
  }
};

module.exports = deleteExistingCalendarEvents;
