'use client'
import React, { useState, useEffect } from 'react';
import { set } from 'firebase/database';
import ApiCalendar from 'react-google-calendar-api';
import Calendar from 'react-calendar';

const config = {
  "clientId": process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_CLIENT_ID,
  "apiKey": process.env.NEXT_PUBLIC_API_KEY,
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
};

const apiCalendar = new ApiCalendar(config);

const TestDemo = () => {
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [signIn, setSignIn] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventTime, setNewEventTime] = useState(480);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (signIn) {
      apiCalendar.listUpcomingEvents(10).then(({ result }) => {
        setEvents(result.items);
      });
    }
  }, [signIn]);

  const handleItemClick = (event, name) => {
    if (name === 'sign-in') {
      apiCalendar.handleAuthClick()
      setSignIn(true);
    } else if (name === 'sign-out') {
      apiCalendar.handleSignoutClick();
      setSignIn(false);
      setEvents([]); // Clear events when signing out
    }
  };

  return (
    <div>
      <div style={{ padding: "0.5em" }}>
        {!signIn &&<button onClick={(e) => handleItemClick(e, "sign-in")}>Sign In</button>}
        {signIn && <button onClick={(e) => handleItemClick(e, "sign-out")}>Sign Out</button>}
      </div>

      <div style={{ padding: "0.5em" }}>
        <input type="text" placeholder="Event title" onChange={(e) => setNewEventTitle(e.target.value)} />
        <input type="text" placeholder="Event description" onChange={(e) => setNewEventDescription(e.target.value)} />
        <input type="number" placeholder="Event time" onChange={(e) => setNewEventTime(e.target.value)} />
        <button
          onClick={() => {
            const eventFromNow = {
              summary: newEventTitle,
              description: newEventDescription,
              time: newEventTime,
            };

            apiCalendar
              .createEventFromNow(eventFromNow)
              .then((result) => {
                console.log(result);
                setNewEventTitle("");
                setNewEventDescription("");
                setNewEventTime(480);
                // Refresh the events after creating a new one
                apiCalendar.listUpcomingEvents(10).then(({ result }) => {
                  setEvents(result.items);
                });
              })
              .catch((error) => {
                console.log(error);
              });
              
          }}
        >
          Create Event from now
        </button>
      </div>

      <div style={{ padding: "0.5em" }}>
        {signIn && (
          <div>
            <Calendar
              onChange={(date) => setSelectedDate(date)}
              value={selectedDate}
            />
            <h4>Events on {selectedDate.toDateString()}</h4>
            {events.length === 0 && <p>No events to show</p>}
            {events
              .filter(event => new Date(event.start.dateTime).toDateString() === selectedDate.toDateString())
              .map((event) => (
                <p key={event.id}>{event.summary}</p>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestDemo;

// import { set } from 'firebase/database';
// import {
//   useState,
// } from 'react';

// import ApiCalendar from 'react-google-calendar-api';

// const config = {
//   "clientId": process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_CLIENT_ID,
//   "apiKey": process.env.NEXT_PUBLIC_API_KEY,
//   "scope": "https://www.googleapis.com/auth/calendar",
//   "discoveryDocs": [
//     "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
//   ]
// }

// const apiCalendar = new ApiCalendar(config)

// const TestDemo = () => {
//   const [events, setEvents] = useState([]);
//   const [calendars, setCalendars] = useState([]);
//   const [signIn, setSignIn] = useState(false);
//   const [newEventTitle, setNewEventTitle] = useState("");
//   const [newEventDescription, setNewEventDescription] = useState("");
//   const [newEventTime, setNewEventTime] = useState(480);

//   const handleItemClick = (event, name) => {
//     if (name === 'sign-in') {
//       apiCalendar.handleAuthClick()
//       setSignIn(true)
//     } 
//     else if (name === 'sign-out') {
//       apiCalendar.handleSignoutClick();
//       setSignIn(false)
//     }
//   };

//   return (
//     <div>
//       <div style={{ padding: "0.5em" }}>
//         {!signIn &&<button onClick={(e) => handleItemClick(e, "sign-in")}>sign-in</button>}
//         {signIn && <button onClick={(e) => handleItemClick(e, "sign-out")}>
//           sign-out
//         </button>}
//       </div>

//       {/*create event from now*/}
//       <div style={{ padding: "0.5em" }}>
//         <input type="text" placeholder="Event title" onChange={(e) => setNewEventTitle(e.target.value)} />
//         <input type="text" placeholder="Event description" onChange={(e) => setNewEventDescription(e.target.value)} />
//         <input type="number" placeholder="Event time" onChange={(e) => setNewEventTime(e.target.value)} />
//         <button
//           onClick={(e) => {
//             const eventFromNow = {
//               summary: newEventTitle,
//               description: newEventDescription,
//               time: newEventTime,
//             };

//             apiCalendar
//               .createEventFromNow(eventFromNow)
//               .then((result) => {
//                 console.log(result);
//               })
//               .catch((error) => {
//                 console.log(error);
//               });
//           }}
//         >
//           Create Event from now
//         </button>
//       </div>
//       <div style={{ padding: "0.5em" }}>
//         <button
//           onClick={(e) => {
//             apiCalendar.listUpcomingEvents(10).then(({ result }) => {
//               console.log(result.items);
//               setEvents(result.items);
//             });
//           }}
//         >
//           List upcoming events
//         </button>
//         <div>
//           <h4>Events</h4>
//           {events.length === 0 && <p>No events to show</p>}
//           {events.map((event) => (
//             <p key={event.id}>{JSON.stringify(event)}</p>
//           ))}
//         </div>
//       </div>
//       <div style={{ padding: "0.5em" }}>
//         <button
//           onClick={(e) => {
//             apiCalendar.listCalendars().then(({ result }) => {
//               console.log(result.items);
//               setCalendars(result.items);
//             });
//           }}
//         >
//           List calendars
//         </button>
//         <div>
//           <h4>Calendars</h4>
//           {calendars.length === 0 && <p>No calendars to show</p>}
//           {calendars.map((calendar) => (
//             <p key={calendar.id}>{JSON.stringify(calendar)}</p>
//           ))}
//         </div>
//       </div>
//       <div style={{ padding: "0.5em" }}>
//         <button
//           onClick={(e) => {
//             apiCalendar.createCalendar("myCalendar2").then(({ result }) => {
//               console.log(result);
//             });
//           }}
//         >
//           Create calendar
//         </button>
//        </div>
//     </div>
//   );
// }

// export default TestDemo