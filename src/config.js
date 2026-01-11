const mustGet = (key) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
};

const truthy = (v) => ['1', 'true', 'yes', 'on'].includes(String(v || '').toLowerCase());

const SOURCE_WEBSITE = mustGet('SOURCE_WEBSITE');
const USER_LOCATION = process.env.USER_LOCATION || '';
const GOOGLE_CALENDAR_ID = mustGet('GOOGLE_CALENDAR_ID');
const CRON_SECRET = mustGet('CRON_SECRET');
const SERVICE_ACCOUNT_KEY = mustGet('SERVICE_ACCOUNT_KEY');

// Keep raw envs if you want them visible, but also export derived flags.
const VERCEL = process.env.VERCEL;
const AWS_LAMBDA_FUNCTION_VERSION = process.env.AWS_LAMBDA_FUNCTION_VERSION;
const AWS_EXECUTION_ENV = process.env.AWS_EXECUTION_ENV;

const IS_SERVERLESS = VERCEL === '1' || !!AWS_LAMBDA_FUNCTION_VERSION || !!AWS_EXECUTION_ENV;

const MOCK_SCRAPE = truthy(process.env.MOCK_SCRAPE);

const USER_PREFERENCES = {
  TIMEZONE: 'Europe/London',
  LOCATION: USER_LOCATION,
  GOOGLE_CALENDAR_EVENT_COLOUR_ID: '6', // 6 orange
  CALENDAR_ID: GOOGLE_CALENDAR_ID,
};

const DATETIME_OPTIONS = {
  FORMAT: 'YYYY-MM-DDTHH:mm:ss+01:00',
  EVENT_START_TIME: 8,
  EVENT_END_TIME: 10,
  DAY_EOP: 18,
};

module.exports = {
  SOURCE_WEBSITE,
  USER_PREFERENCES,
  DATETIME_OPTIONS,
  CRON_SECRET,
  SERVICE_ACCOUNT_KEY,

  // raw envs (optional)
  VERCEL,
  AWS_LAMBDA_FUNCTION_VERSION,
  AWS_EXECUTION_ENV,

  // derived flags (recommended)
  IS_SERVERLESS,
  MOCK_SCRAPE,
};
