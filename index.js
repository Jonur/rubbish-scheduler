const { google } = require('googleapis');

const {
  createCalendarEvents,
  deleteExistingCalendarEvents,
  getExistingCalendarEvents,
  getOAuth2Client,
  getShouldBeUsingMocks,
  getWasteCollectionsData,
  insertEventsIntoCalendar,
} = require('./src/utils');

(async () => {
  const oauth2Client = getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const wasteCollectionsData = getShouldBeUsingMocks() || (await getWasteCollectionsData());

  const calendarEvents = createCalendarEvents(wasteCollectionsData);

  const existingCalendarEvents = await getExistingCalendarEvents(calendar, calendarEvents);

  await deleteExistingCalendarEvents(calendar, oauth2Client, existingCalendarEvents);

  insertEventsIntoCalendar(calendar, oauth2Client, calendarEvents);
})();
