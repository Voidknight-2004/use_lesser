import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GeminiChatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Replace 'YOUR_API_KEY' with your actual Gemini API key
    const genAI = new GoogleGenerativeAI(AIzaSyAe4yayqJcVT84tceVbZQg5okyj0xhD5Gg);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    try {
      const result = await model.generateContent(prompt);
      setResponse(result.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Gemini Chatbot</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <p>{response}</p>
    </div>
  );
};

export default GeminiChatbot;