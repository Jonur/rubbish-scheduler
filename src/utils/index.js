const exposeFunctions = require('./puppeteer/exposeFunctions');
const getWasteCollectionsData = require('./puppeteer/getWasteCollectionsData');
const googleCalendarUtils = require('./googleCalendar');

module.exports = {
  exposeFunctions,
  getWasteCollectionsData,
  ...googleCalendarUtils,
};
