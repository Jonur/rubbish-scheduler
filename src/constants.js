const dotenv = require('dotenv');

dotenv.config();

// Environment variables
const SOURCE_WEBSITE = process.env.SOURCE_WEBSITE;
const USER_LOCATION = process.env.USER_LOCATION;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const CRON_SECRET = process.env.CRON_SECRET;
const SERVICE_ACCOUNT_KEY = process.env.SERVICE_ACCOUNT_KEY;
const VERCEL = process.env.VERCEL;
const AWS_LAMBDA_FUNCTION_VERSION = process.env.AWS_LAMBDA_FUNCTION_VERSION;
const AWS_EXECUTION_ENV = process.env.AWS_EXECUTION_ENV;
const MOCK_SCRAPE = process.env.MOCK_SCRAPE;

const USER_PREFERENCES = {
  TIMEZONE: 'Europe/London',
  LOCATION: USER_LOCATION,
  /**
   * Google Calendar event colour IDs
   * 1 blue
   * 2 green
   * 3 purple
   * 4 red
   * 5 yellow
   * 6 orange
   * 7 turquoise
   * 8 gray
   * 9 bold blue
   * 10 bold green
   * 11 bold red
   */
  GOOGLE_CALENDAR_EVENT_COLOUR_ID: '6',
  CALENDAR_ID: GOOGLE_CALENDAR_ID,
};

const DATETIME_OPTIONS = {
  FORMAT: 'YYYY-MM-DDTHH:mm:ss+01:00',
  EVENT_START_TIME: 8,
  EVENT_END_TIME: 10,
  DAY_EOP: 18,
};

module.exports = {
  DATETIME_OPTIONS,
  SOURCE_WEBSITE,
  USER_PREFERENCES,
  CRON_SECRET,
  SERVICE_ACCOUNT_KEY,
  VERCEL,
  AWS_LAMBDA_FUNCTION_VERSION,
  AWS_EXECUTION_ENV,
  MOCK_SCRAPE,
};
