const getShouldBeUsingMocks = require('./environment/getShouldBeUsingMocks');
const getWasteCollectionsData = require('./puppeteer/getWasteCollectionsData');
const googleCalendarUtils = require('./googleCalendar');

module.exports = {
  getShouldBeUsingMocks,
  getWasteCollectionsData,
  ...googleCalendarUtils,
};
