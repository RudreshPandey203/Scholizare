// // src/components/Chatbot.js
'use client'
// /pages/student/[studentid]/doubtSolver/page.jsx

import React, { useState } from 'react';
import axios from 'axios';

const DoubtSolverPage = ({ studentid }) => {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/', { userInput });
      setResponse(response.data.response);
      console.log(response.data.response);
      console.log("reached here");
    } catch (error) {
      console.error('Error in submitting user input:', error);
      setResponse('Internal Server Error');
    }
  };

  return (
    <div>
      <h1>Doubt Solver Page for Student {studentid}</h1>
      <div>
        <textarea
          rows="4"
          cols="50"
          placeholder="Type your doubt here..."
          value={userInput}
          onChange={handleUserInput}
        />
      </div>
      <div>
        <button onClick={handleSubmit}>Submit Doubt</button>
      </div>
      {response && (
        <div>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

// Fetches studentid from the URL and passes it as a prop
DoubtSolverPage.getInitialProps = ({ query }) => {
  return { studentid: query.studentid };
};

export default DoubtSolverPage;



// 'use client'
// import React, { useState, useEffect } from 'react';

// const Chatbot = () => {
//   const [chatHistory, setChatHistory] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const serverUrl = 'http://localhost:4000';


//   const sendMessage = async () => {
//     if (!userInput) return;

//     setChatHistory([...chatHistory, { role: 'user', text: userInput }]);
//     setUserInput('');
//     setLoading(true);

//     try {
//       const response = await fetch(`${serverUrl}/utils/server`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userInput }),
//       });

//       const data = await response.json();
//       const botMessage = data.response;

//       setChatHistory([...chatHistory, { role: 'bot', text: botMessage }]);
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('/');
//         const data = await response.text();
//         console.log(data);
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Scholizare's Dolphin</h1>
//       <div style={{ height: '300px', overflowY: 'scroll' }}>
//         {chatHistory.map((message, index) => (
//           <div
//             key={index}
//             style={{
//               textAlign: message.role === 'user' ? 'right' : 'left',
//               padding: '10px',
//               backgroundColor: message.role === 'user' ? '#f0f0f0' : '#e0f0e0',
//               borderRadius: '10px',
//               marginBottom: '5px',
//             }}
//           >
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           sendMessage();
//         }}
//         style={{ display: 'flex' }}
//       >
//         <input
//           type="text"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder="Enter your message"
//           style={{ flexGrow: 1, marginRight: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
//         />
//         <button
//           type="submit"
//           style={{
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             border: 'none',
//             padding: '10px 15px',
//             borderRadius: '5px',
//             cursor: 'pointer',
//           }}
//         >
//           Send
//         </button>
//       </form>
//       {loading && (
//         <div style={{ display: 'block', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
//           <img src="loader.gif" width="150px" alt="Loading..." />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;
