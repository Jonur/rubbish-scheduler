const { google } = require('googleapis');

const assertCronAuth = require('../lib/assertCronAuth');
const getShouldBeUsingMocks = require('../lib/getShouldBeUsingMocks');
const getWasteCollectionsData = require('../lib/getWasteCollectionsData');
const createCalendarEvents = require('../lib/createCalendarEvents');
const deleteExistingCalendarEvents = require('../lib/deleteExistingCalendarEvents');
const OAuth2Client = require('../lib/getOAuth2Client');
const getExistingCalendarEvents = require('../lib/getExistingCalendarEvents');
const insertEventsIntoCalendar = require('../lib/insertEventsIntoCalendar');

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
