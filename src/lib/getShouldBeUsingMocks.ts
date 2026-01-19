import { puppeteerResponseMock } from "../__mocks__";
import { MOCK_SCRAPE } from "../config";

const getShouldBeUsingMocks = () => (MOCK_SCRAPE ? puppeteerResponseMock : null);

export default getShouldBeUsingMocks;
