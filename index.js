const { google } = require('googleapis');

const {
  createCalendarEvents,
  getExistingCalendarEvents,
  getOAuth2Client,
  getWasteCollectionsData,
  updateCalendarWithEvents,
} = require('./src/utils');

(async () => {
  const oauth2Client = getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const wasteCollectionsData = await getWasteCollectionsData();

  const calendarEvents = createCalendarEvents(wasteCollectionsData);

  const existingCalendarEvents = await getExistingCalendarEvents(calendar, calendarEvents);

  updateCalendarWithEvents(calendar, oauth2Client, calendarEvents, existingCalendarEvents);
})();
