import { puppeteerResponseMock } from "../__mocks__/api";
import { MOCK_SCRAPE } from "../config";

const getShouldBeUsingMocks = () => (MOCK_SCRAPE ? puppeteerResponseMock : null);

export default getShouldBeUsingMocks;
