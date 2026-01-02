const { google } = require('googleapis');

const {
  assertCronAuth,
  createCalendarEvents,
  deleteExistingCalendarEvents,
  getExistingCalendarEvents,
  getShouldBeUsingMocks,
  getWasteCollectionsData,
  insertEventsIntoCalendar,
  OAuth2Client,
} = require('../libs');

const wasteCollectionCalendar = async (req, res) => {
  try {
    assertCronAuth(req);

    const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

    const wasteCollectionsData = getShouldBeUsingMocks() || (await getWasteCollectionsData());
    const calendarEvents = createCalendarEvents(wasteCollectionsData);

    const existingCalendarEvents = await getExistingCalendarEvents(calendar, calendarEvents);
    await deleteExistingCalendarEvents(calendar, existingCalendarEvents);

    await insertEventsIntoCalendar(calendar, calendarEvents);

    res.status(200).send('All events created!');
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).send(error.message || 'Internal error');
  }
};

module.exports = wasteCollectionCalendar;
