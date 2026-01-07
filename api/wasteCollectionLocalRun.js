require('dotenv').config();
const { google } = require('googleapis');

const {
  createCalendarEvents,
  deleteExistingCalendarEvents,
  getExistingCalendarEvents,
  getShouldBeUsingMocks,
  getWasteCollectionsData,
  insertEventsIntoCalendar,
  OAuth2Client,
} = require('../libs');

(async () => {
  const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

  const wasteCollectionsData = getShouldBeUsingMocks() || (await getWasteCollectionsData());
  const calendarEvents = createCalendarEvents(wasteCollectionsData);

  const existingCalendarEvents = await getExistingCalendarEvents(calendar, calendarEvents);
  await deleteExistingCalendarEvents(calendar, existingCalendarEvents);

  await insertEventsIntoCalendar(calendar, calendarEvents);

  console.log('✅ All events created!');
})().catch((err) => {
  console.error('❌ Run failed:', err);
  process.exitCode = 1;
});
