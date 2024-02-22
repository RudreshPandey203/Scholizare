// GoogleCalendar.js
'use client'
import { useEffect } from 'react';

const GoogleCalendar = () => {
  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY_GOOGLE_CALENDAR;
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.defer = true;
    script1.onload = gapiLoaded;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    script2.onload = gisLoaded;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  function gapiLoaded() {
    window.gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  }

  function gisLoaded() {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: handleTokenCallback, // Define the callback here
    });
    gisInited = true;
    maybeEnableButtons();
  }

  function maybeEnableButtons() {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  }

  // Define the callback function
  const handleTokenCallback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    await listUpcomingEvents();
  };

  function handleAuthClick() {
    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      document.getElementById('content').innerText = '';
      document.getElementById('authorize_button').innerText = 'Authorize';
      document.getElementById('signout_button').style.visibility = 'hidden';
    }
  }

  async function listUpcomingEvents() {
    // Rest of the listUpcomingEvents function remains the same...
    // Rest of the listUpcomingEvents function remains the same...
    let response;
        try {
          const request = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
          };
          response = await gapi.client.calendar.events.list(request);
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }
  }

  return (
    <div>
      <p>Google Calendar API Quickstart</p>
      <button id="authorize_button" onClick={handleAuthClick}>
        Authorize
      </button>
      <button id="signout_button" onClick={handleSignoutClick}>
        Sign Out
      </button>
      <pre id="content" style={{ whiteSpace: 'pre-wrap' }}></pre>
    </div>
  );
};

export default GoogleCalendar;
