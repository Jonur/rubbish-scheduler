const { USER_PREFERENCES } = require('../../constants');

const insertEventsIntoCalendar = (auth, calendar, calendarEvents) => {
  calendarEvents.forEach((event) => {
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
          console.log('Event created');
        }
      }
    );
  });
};

module.exports = insertEventsIntoCalendar;
