// libs/environment/getShouldBeUsingMocks.js
const { puppeteerResponseMock } = require('../__mocks__');

const truthy = (v) => ['1', 'true', 'yes', 'on'].includes(String(v || '').toLowerCase());

const getShouldBeUsingMocks = () => (truthy(process.env.MOCK_SCRAPE) ? puppeteerResponseMock : null);

module.exports = getShouldBeUsingMocks;
