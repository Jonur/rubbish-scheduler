const dayjs = require('dayjs');

const { USER_PREFERENCES, DATETIME_OPTIONS } = require('../../constants');

const updateCalendarWithEvents = (calendar, oauth2Client, calendarEvents, existingCalendarEvents) => {
  calendarEvents.forEach((event) => {
    const eventExists = !!existingCalendarEvents?.data?.items?.find(
      (e) =>
        e.summary === event.summary &&
        dayjs(event.start.dateTime).format(DATETIME_OPTIONS.FORMAT) ===
          dayjs(e.start.dateTime).format(DATETIME_OPTIONS.FORMAT)
    );

    if (!eventExists) {
      calendar.events.insert(
        {
          auth: oauth2Client,
          calendarId: USER_PREFERENCES.CALENDAR_ID,
          resource: event,
        },
        (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Event created');
          }
        }
      );
    }
  });
};

module.exports = updateCalendarWithEvents;
