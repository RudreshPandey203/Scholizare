'use client'
import React, { useState } from 'react';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loaderVisible, setLoaderVisible] = useState(false);

  const sendMessage = async () => {
    setLoaderVisible(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      const botMessage = data.response;

      // Update chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'user', message: userInput },
        { type: 'bot', message: botMessage },
      ]);

      // Clear user input
      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    } finally {
      setLoaderVisible(false);
    }
  };

  return (
    <div id="chat-container">
      <h1>Scholizare's Mental Health Chatbot</h1>
      <div id="chat-history">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={chat.type === 'user' ? 'user-message' : 'bot-message'}
          >
            {chat.message}
          </div>
        ))}
      </div>
      <form
        id="chat-form"
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
        <button type="submit">Send</button>
      </form>
      <div id="loader" style={{ display: loaderVisible ? 'block' : 'none' }}>
        <img src="loader.gif" width="150px" alt="Loading..." />
      </div>
    </div>
  );
};

export default Chatbot;
