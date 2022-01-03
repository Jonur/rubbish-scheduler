const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const credentials = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
const scopes = 'https://www.googleapis.com/auth/calendar';

const OAuth2Client = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);

module.exports = OAuth2Client;
