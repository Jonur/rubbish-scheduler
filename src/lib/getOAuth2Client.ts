import { google } from "googleapis";

import { SERVICE_ACCOUNT_KEY } from "../config";

const credentials = JSON.parse(SERVICE_ACCOUNT_KEY);

const OAuth2Client = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const getOAuth2Client = () => OAuth2Client;

export default getOAuth2Client;
