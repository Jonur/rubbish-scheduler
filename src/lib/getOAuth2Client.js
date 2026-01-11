const { google } = require('googleapis');

const { SERVICE_ACCOUNT_KEY } = require('../config');

const credentials = JSON.parse(SERVICE_ACCOUNT_KEY);

// IMPORTANT: convert literal \n to real newlines
credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

const scopes = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes,
});

module.exports = auth;
