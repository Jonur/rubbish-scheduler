const { USER_PREFERENCES } = require('../constants');

const insertEventsIntoCalendar = async (calendar, calendarEvents = []) => {
  if (!calendarEvents.length) return;

  for (const event of calendarEvents) {
    await calendar.events.insert({
      calendarId: USER_PREFERENCES.CALENDAR_ID,
      resource: event,
    });
  }

  console.log(`Inserted ${calendarEvents.length} events`);
};

module.exports = insertEventsIntoCalendar;

module.exports = insertEventsIntoCalendar;
