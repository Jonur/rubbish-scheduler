const { USER_PREFERENCES } = require('../../constants');

const deleteExistingCalendarEvents = async (calendar, oauth2Client, existingCalendarEvents) => {
  const events = existingCalendarEvents?.data?.items || [];

  for (const event of events) {
    await calendar.events.delete({
      auth: oauth2Client,
      calendarId: USER_PREFERENCES.CALENDAR_ID,
      eventId: event.id,
    });
  }
};

module.exports = deleteExistingCalendarEvents;
