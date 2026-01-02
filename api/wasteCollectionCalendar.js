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
  const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

  let wasteCollectionsData = [];
  try {
    wasteCollectionsData = getShouldBeUsingMocks() || (await getWasteCollectionsData());
  } catch (error) {
    console.error('Error fetching waste collections data:', error);
  }

  const calendarEvents = createCalendarEvents(wasteCollectionsData);

  let existingCalendarEvents;
  try {
    existingCalendarEvents = await getExistingCalendarEvents(calendar, calendarEvents);
  } catch (error) {
    console.error('Error fetching existing calendar events:', error);
  }

  try {
    await deleteExistingCalendarEvents(calendar, existingCalendarEvents);
  } catch (error) {
    console.error('Error deleting existing calendar events:', error);
  }

  try {
    await insertEventsIntoCalendar(calendar, calendarEvents);
    res?.send?.('All events created!');
  } catch (error) {
    console.error('Error inserting new calendar events:', error);
  }
};

module.exports = wasteCollectionCalendar;
