// pages/student/[studentid]/doubtSolver/index.jsx
'use client'
import { useState } from 'react';
import axios from 'axios';

export default function DoubtSolverPage({ studentid }) {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/chatbot/', { userInput });
      const botMessage = response.data.response;

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', text: userInput },
        { role: 'bot', text: botMessage },
      ]);

      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Doubt Solver</h1>
      <div id="chat-container">
        <div id="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className={`${message.role}-message`}>
              {message.text}
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your message"
          />
          <button type="submit" disabled={loading}>
            Send
          </button>
        </form>
      </div>
      {loading && (
        <div id="loader">
          <img src="/loader.gif" width="150px" alt="Loading..." />
        </div>
      )}
    </div>
  );
}

DoubtSolverPage.getInitialProps = ({ query }) => {
  return { studentid: query.studentid };
};
