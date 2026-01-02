const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const credentials = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

// IMPORTANT: convert literal \n to real newlines
credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

const scopes = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes,
  // If you are accessing a *user's primary calendar*, you usually need delegation:
  // subject: process.env.CALENDAR_USER_EMAIL,
});

module.exports = auth;
