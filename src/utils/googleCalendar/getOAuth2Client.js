const dotenv = require('dotenv');
const { google } = require('googleapis');

dotenv.config();

const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const getOAuth2Client = () => oauth2Client;

module.exports = getOAuth2Client;
