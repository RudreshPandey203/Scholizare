'use client'
// import React, {ReactNode, SyntheticEvent} from 'react';
// import ApiCalendar from 'react-google-calendar-api';

// const config = {
//   "clientId": process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//   "apiKey": process.env.NEXT_PUBLIC_API_KEY,
//   "scope": "https://www.googleapis.com/auth/calendar",
//   "discoveryDocs": [
//     "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
//   ]
// }

// const apiCalendar = new ApiCalendar(config)
// console.log("config", config)

// console.log('apiCalendar', apiCalendar)

// export default function CalendarPage() {
// return(
//   <div>hello</div>
// )
// }
import 'whatwg-fetch';
import React from 'react';

import Scheduler, { SchedulerTypes } from 'devextreme-react/scheduler';

import CustomStore from 'devextreme/data/custom_store';

const getData = async (_, requestOptions) => {
  const GOOGLE_CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars/';
  const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const dataUrl = [GOOGLE_CALENDAR_URL, CALENDAR_ID, '/events?key=', PUBLIC_KEY].join('');

  const response = await fetch(dataUrl, requestOptions);

  const data = await response.json();

  return data.items;
};

const dataSource = new CustomStore({
  load: (options) => getData(options, { showDeleted: false }),
});

const currentDate = new Date(2017, 4, 25);
const views = ['day', 'workWeek', 'month'];

const App = () => (
  <React.Fragment>
    <div className="long-title">
      <h3>Tasks for Employees (USA Office)</h3>
    </div>
    <Scheduler
      dataSource={dataSource}
      views={views}
      defaultCurrentView="workWeek"
      defaultCurrentDate={currentDate}
      height={500}
      startDayHour={7}
      editing={false}
      showAllDayPanel={false}
      startDateExpr="start.dateTime"
      endDateExpr="end.dateTime"
      textExpr="summary"
      timeZone="America/Los_Angeles"
    />
  </React.Fragment>
);

export default App;


// // 'use client'
// // import React, { useState, useEffect } from 'react';
// // import ApiCalendar from 'react-google-calendar-api';
// // import 'tailwindcss/base.css';

// // const config = {
// //   "clientId": "329972626495-qml5lq35ffv21lia4nm93ejmigr4pct5.apps.googleusercontent.com",
// //   "apiKey": "AIzaSyCy51_Wq0cMrT5UTnjfcdQ4RIwUG90MuAM",
// //   "scope": "https://www.googleapis.com/auth/calendar",
// //   "discoveryDocs": [
// //     "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
// //   ]
// // };

// // const apiCalendar = new ApiCalendar(config);

// // export default function DoubleButton() {
// //   const [events, setEvents] = useState([]);
// //   const [newEventTitle, setNewEventTitle] = useState('');
// //   const [newEventDate, setNewEventDate] = useState('');
// //   const [newEventTime, setNewEventTime] = useState('');
// //   const [isSignedIn, setIsSignedIn] = useState(true);

// //   useEffect(() => {
// //     checkSignInStatus();
// //     fetchEvents();
// //   }, []);

// //   async function checkSignInStatus() {
// //     try {
// //       const signedIn = await apiCalendar.isSignedIn();
// //       setIsSignedIn(signedIn);
// //     } catch (error) {
// //       console.error('Error checking sign-in status:', error);
// //     }
// //   }

// //   function handleItemClick(event, name) {
// //     if (name === 'sign-in') {
// //       apiCalendar.handleAuthClick();
// //     } else if (name === 'sign-out') {
// //       apiCalendar.handleSignoutClick();
// //     }
// //   }

// //   async function fetchEvents() {
// //     try {
// //       if (isSignedIn) {
// //         const events = await apiCalendar.getEvents();
// //         setEvents(events);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching events:', error);
// //     }
// //   }

// //   async function createEvent() {
// //     try {
// //       const dateTime = `${newEventDate} ${newEventTime}`;
// //       await apiCalendar.createEvent({
// //         title: newEventTitle,
// //         start: new Date(dateTime),
// //       });
// //       setNewEventTitle('');
// //       setNewEventDate('');
// //       setNewEventTime('');
// //       fetchEvents();
// //     } catch (error) {
// //       console.error('Error creating event:', error);
// //     }
// //   }

// //   return (
// //     <div className="double-button-container">
// //       {isSignedIn ? (
// //         <button className="sign-out-button" onClick={(e) => handleItemClick(e, 'sign-out')}>
// //           Sign Out
// //         </button>
// //       ) : (
// //         <button className="sign-in-button" onClick={(e) => handleItemClick(e, 'sign-in')}>
// //           Sign In
// //         </button>
// //       )}

// //       {isSignedIn && events.length > 0 && (
// //         <div className="mt-4">
// //           <h3 className="text-lg font-bold mb-2">Your Events:</h3>
// //           <ul>
// //             {events.map((event) => (
// //               <li key={event.id} className="mb-1">
// //                 {event.summary}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}

// //       {isSignedIn && (
// //         <div className="mt-4">
// //           <input
// //             type="text"
// //             value={newEventTitle}
// //             onChange={(e) => setNewEventTitle(e.target.value)}
// //             placeholder="New event title"
// //             className="border p-2 mr-2"
// //           />
// //           <input
// //             type="date"
// //             value={newEventDate}
// //             onChange={(e) => setNewEventDate(e.target.value)}
// //             className="border p-2 mr-2"
// //           />
// //           <input
// //             type="time"
// //             value={newEventTime}
// //             onChange={(e) => setNewEventTime(e.target.value)}
// //             className="border p-2 mr-2"
// //           />
// //           <button onClick={createEvent} className="bg-blue-500 text-white px-4 py-2 rounded">
// //             Create Event
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
