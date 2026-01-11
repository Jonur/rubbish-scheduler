const { google } = require('googleapis');

const assertCronAuth = require('../helpers/assertCronAuth');
const getShouldBeUsingMocks = require('../helpers/getShouldBeUsingMocks');
const getWasteCollectionsData = require('../helpers/getWasteCollectionsData');
const createCalendarEvents = require('../helpers/createCalendarEvents');
const deleteExistingCalendarEvents = require('../helpers/deleteExistingCalendarEvents');
const OAuth2Client = require('../helpers/getOAuth2Client');
const getExistingCalendarEvents = require('../helpers/getExistingCalendarEvents');
const insertEventsIntoCalendar = require('../helpers/insertEventsIntoCalendar');

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
