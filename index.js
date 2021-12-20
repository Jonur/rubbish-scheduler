const { google } = require('googleapis');

const {
  createCalendarEvents,
  deleteExistingCalendarEvents,
  getExistingCalendarEvents,
  getShouldBeUsingMocks,
  getWasteCollectionsData,
  insertEventsIntoCalendar,
  OAuth2Client,
} = require('./src/utils');

(async () => {
  const calendar = google.calendar({ version: 'v3' });

  const wasteCollectionsData = getShouldBeUsingMocks() || (await getWasteCollectionsData());

  const calendarEvents = createCalendarEvents(wasteCollectionsData);

  const existingCalendarEvents = await getExistingCalendarEvents(OAuth2Client, calendar, calendarEvents);

  await deleteExistingCalendarEvents(OAuth2Client, calendar, existingCalendarEvents);

  insertEventsIntoCalendar(OAuth2Client, calendar, calendarEvents);
})();
