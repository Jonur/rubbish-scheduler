const { google } = require('googleapis');

const getShouldBeUsingMocks = require('./getShouldBeUsingMocks');
const getWasteCollectionsData = require('./getWasteCollectionsData');
const createCalendarEvents = require('./createCalendarEvents');
const deleteExistingCalendarEvents = require('./deleteExistingCalendarEvents');
const getExistingCalendarEvents = require('./getExistingCalendarEvents');
const insertEventsIntoCalendar = require('./insertEventsIntoCalendar');
const OAuth2Client = require('./getOAuth2Client');

const runWasteCollectionSync = async () => {
  const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

  const wasteCollectionsData = getShouldBeUsingMocks() || (await getWasteCollectionsData());
  const calendarEvents = createCalendarEvents(wasteCollectionsData);

  const existingCalendarEvents = await getExistingCalendarEvents(calendar, calendarEvents);
  await deleteExistingCalendarEvents(calendar, existingCalendarEvents);

  await insertEventsIntoCalendar(calendar, calendarEvents);

  return {
    created: calendarEvents.length,
    deleted: (existingCalendarEvents?.data?.items || existingCalendarEvents || []).length,
  };
};

module.exports = runWasteCollectionSync;
