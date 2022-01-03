const createCalendarEvents = require('./createCalendarEvents');
const deleteExistingCalendarEvents = require('./deleteExistingCalendarEvents');
const OAuth2Client = require('./getOAuth2Client');
const getExistingCalendarEvents = require('./getExistingCalendarEvents');
const insertEventsIntoCalendar = require('./insertEventsIntoCalendar');

module.exports = {
  createCalendarEvents,
  deleteExistingCalendarEvents,
  getExistingCalendarEvents,
  insertEventsIntoCalendar,
  OAuth2Client,
};
