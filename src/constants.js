const dotenv = require('dotenv');

dotenv.config();

const SOURCE_WEBSITE = process.env.SOURCE_WEBSITE;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const USER_PREFERENCES = {
  TIMEZONE: 'Europe/London',
  LOCATION: process.env.USER_LOCATION,
  GOOGLE_CALENDAR_EVENT_COLOUR_ID: '6',
  CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
};

const DATETIME_OPTIONS = {
  FORMAT: 'YYYY-MM-DDTHH:mm:ss+01:00',
  EVENT_START_TIME: 8,
  EVENT_END_TIME: 10,
  DAY_EOP: 18,
};

module.exports = {
  DATETIME_OPTIONS,
  MONTHS,
  SOURCE_WEBSITE,
  USER_PREFERENCES,
};
