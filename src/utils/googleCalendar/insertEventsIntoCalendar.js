const dayjs = require('dayjs');

const { USER_PREFERENCES } = require('../../constants');

const insertEventsIntoCalendar = (calendar, oauth2Client, calendarEvents) => {
  calendarEvents.forEach((event) => {
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
  });
};

module.exports = insertEventsIntoCalendar;
