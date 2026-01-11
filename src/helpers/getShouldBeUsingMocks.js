const { puppeteerResponseMock } = require('../__mocks__');

const { MOCK_SCRAPE } = require('../constants');

const truthy = (v) => ['1', 'true', 'yes', 'on'].includes(String(v || '').toLowerCase());

const getShouldBeUsingMocks = () => (truthy(MOCK_SCRAPE) ? puppeteerResponseMock : null);

module.exports = getShouldBeUsingMocks;
