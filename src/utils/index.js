const exposeFunctions = require('./puppeteer/exposeFunctions');
const getShouldBeUsingMocks = require('./environment/getShouldBeUsingMocks');
const getWasteCollectionsData = require('./puppeteer/getWasteCollectionsData');
const googleCalendarUtils = require('./googleCalendar');

module.exports = {
  exposeFunctions,
  getShouldBeUsingMocks,
  getWasteCollectionsData,
  ...googleCalendarUtils,
};
