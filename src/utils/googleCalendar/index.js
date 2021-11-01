const createCalendarEvents = require('./createCalendarEvents');
const deleteExistingCalendarEvents = require('./deleteExistingCalendarEvents');
const getOAuth2Client = require('./getOAuth2Client');
const getExistingCalendarEvents = require('./getExistingCalendarEvents');
const insertEventsIntoCalendar = require('./insertEventsIntoCalendar');

module.exports = {
  createCalendarEvents,
  deleteExistingCalendarEvents,
  getOAuth2Client,
  getExistingCalendarEvents,
  insertEventsIntoCalendar,
};
