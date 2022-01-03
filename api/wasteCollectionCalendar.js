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

const wasteCollectionCalendar = async (_, res) => {
  const calendar = google.calendar({ version: 'v3' });

  const wasteCollectionsData = getShouldBeUsingMocks() || (await getWasteCollectionsData());

  const calendarEvents = createCalendarEvents(wasteCollectionsData);

  const existingCalendarEvents = await getExistingCalendarEvents(OAuth2Client, calendar, calendarEvents);

  await deleteExistingCalendarEvents(OAuth2Client, calendar, existingCalendarEvents);

  insertEventsIntoCalendar(OAuth2Client, calendar, calendarEvents, () => res?.send?.('All events created!'));
};

module.exports = wasteCollectionCalendar;
