const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = 9000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GEMINI_API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
        {
          "role": "user",
          "parts": ["you will Create a conversation flow for a mental health assessment, ensuring it is non-intrusive and sensitive to the user's emotional state"]
        },
        {
          "role": "model",
          "parts": ["**Initial Assessment**\n\n* **Greeting:** \"Hello, I'm here to help you with your mental health assessment. Please feel free to share as much or as little as you feel comfortable with.\"\n* **Open-Ended Question:** \"How are you feeling today?\"\n* **Follow-Up Question (if needed):** \"Can you tell me more about that?\"\n* **Additional Questions (if needed):**\n    * \"Have you been feeling this way for a while?\"\n    * \"Are there any specific things that are causing you to feel this way?\"\n    * \"Do you have any thoughts of hurting yourself or others?\"\n\n**Depression Screening**\n\n* **Question 1:** \"In the past two weeks, have you felt down, depressed, or hopeless?\"\n* **Question 2:** \"In the past two weeks, have you lost interest or pleasure in most activities?\"\n* **Question 3:** \"In the past two weeks, have you had a change in appetite or weight?\"\n* **Question 4:** \"In the past two weeks, have you had trouble sleeping or sleeping too much?\"\n* **Question 5:** \"In the past two weeks, have you felt tired or had low energy?\"\n* **Question 6:** \"In the past two weeks, have you had difficulty concentrating or making decisions?\"\n* **Question 7:** \"In the past two weeks, have you had thoughts of death or suicide?\"\n\n**Anxiety Screening**\n\n* **Question 1:** \"In the past two weeks, have you felt nervous, anxious, or on edge?\"\n* **Question 2:** \"In the past two weeks, have you had a sense of impending doom or danger?\"\n* **Question 3:** \"In the past two weeks, have you had a rapid heart rate or shortness of breath?\"\n* **Question 4:** \"In the past two weeks, have you had sweaty palms or shaky hands?\"\n* **Question 5:** \"In the past two weeks, have you had difficulty concentrating or sleeping?\"\n* **Question 6:** \"In the past two weeks, have you had stomach aches or nausea?\"\n* **Question 7:** \"In the past two weeks, have you had difficulty controlling your worries?\"\n\n**Substance Use Screening**\n\n* **Question 1:** \"In the past year, have you used alcohol or drugs in a way that has caused problems in your life?\"\n* **Question 2:** \"Have you ever felt the need to cut down or stop using alcohol or drugs?\"\n* **Question 3:** \"Have you ever continued to use alcohol or drugs even when you knew it was causing problems in your life?\"\n* **Question 4:** \"Have you ever had problems at work, school, or in your relationships because of alcohol or drugs?\"\n* **Question 5:** \"Have you ever gotten into legal trouble because of alcohol or drugs?\"\n* **Question 6:** \"Have you ever had to go to the hospital or get medical treatment because of alcohol or drugs?\"\n\n**Referral**\n\n* **If the user screens positive for depression, anxiety, or substance use, they will be referred to a mental health professional for further assessment and treatment.**\n* **The user will be given information about the mental health professional, including their name, contact information, and location.**\n* **The user will be encouraged to schedule an appointment with the mental health professional as soon as possible.**\n\n**Follow-Up**\n\n* **The user will be contacted by a mental health professional within 24 hours to schedule an appointment.**\n* **The user will be asked to complete a more comprehensive mental health assessment at their appointment.**\n* **The mental health professional will develop a treatment plan based on the user's needs.**"]
        },
        
      ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index2.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});

app.post('/chat', async (req, res) => {
    try {
      const userInput = req.body?.userInput;
      console.log('incoming /chat req', userInput)
      if (!userInput) {
        return res.status(400).json({ error: 'Invalid request body' });
      }
  
      const response = await runChat(userInput);
      res.json({ response });
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});