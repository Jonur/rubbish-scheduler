const { google } = require('googleapis');

const getShouldBeUsingMocks = require('../helpers/getShouldBeUsingMocks');
const getWasteCollectionsData = require('../helpers/getWasteCollectionsData');
const createCalendarEvents = require('../helpers/createCalendarEvents');
const deleteExistingCalendarEvents = require('../helpers/deleteExistingCalendarEvents');
const OAuth2Client = require('../helpers/getOAuth2Client');
const getExistingCalendarEvents = require('../helpers/getExistingCalendarEvents');
const insertEventsIntoCalendar = require('../helpers/insertEventsIntoCalendar');

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
