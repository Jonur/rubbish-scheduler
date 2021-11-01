const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { puppeteerResponseMock } = require('../../__mocks__');

const { mode = '' } = yargs(hideBin(process.argv)).argv;
const isMockMode = mode === 'mock';

const getShouldBeUsingMocks = () => (isMockMode ? puppeteerResponseMock : null);

module.exports = getShouldBeUsingMocks;
