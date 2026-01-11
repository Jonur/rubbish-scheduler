const { google } = require('googleapis');

const getShouldBeUsingMocks = require('../lib/getShouldBeUsingMocks');
const getWasteCollectionsData = require('../lib/getWasteCollectionsData');
const createCalendarEvents = require('../lib/createCalendarEvents');
const deleteExistingCalendarEvents = require('../lib/deleteExistingCalendarEvents');
const OAuth2Client = require('../lib/getOAuth2Client');
const getExistingCalendarEvents = require('../lib/getExistingCalendarEvents');
const insertEventsIntoCalendar = require('../lib/insertEventsIntoCalendar');

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
