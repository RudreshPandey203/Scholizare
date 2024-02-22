// utils/auth.js
import { google } from 'googleapis';

export const authorize = async () => {
  // Load client secrets from a file, or use a secure method
  const credentials = require('../credentials.js'); // Replace with your own credentials

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token
  const tokenPath = 'token.json'; // Change this path if needed
  let token;

  try {
    token = require(`./${tokenPath}`);
  } catch (error) {
    token = await getAccessToken(oAuth2Client);
    saveToken(tokenPath, token);
  }

  oAuth2Client.setCredentials(token);
  return oAuth2Client;
};

const getAccessToken = async (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  console.log('Authorize this app by visiting this URL:', authUrl);
  const code = ''; // Paste the code obtained from the authorization URL here
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
};

const saveToken = (tokenPath, token) => {
  // Save the token to a file
  require('fs').writeFileSync(tokenPath, JSON.stringify(token));
  console.log('Token stored to', tokenPath);
};
