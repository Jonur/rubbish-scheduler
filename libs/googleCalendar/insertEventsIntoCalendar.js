const { USER_PREFERENCES } = require('../constants');

const insertEventsIntoCalendar = (auth, calendar, calendarEvents, callback) => {
  calendarEvents.forEach((event, index) => {
    calendar.events.insert(
      {
        auth,
        calendarId: USER_PREFERENCES.CALENDAR_ID,
        resource: event,
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Event created: ${event.summary}`);

          const isLastEvent = index === calendarEvents.length - 1;
          if (isLastEvent) {
            callback();
          }
        }
      }
    );
  });
};

module.exports = insertEventsIntoCalendar;
