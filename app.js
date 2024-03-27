const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require('@google/generative-ai');

const MODEL_NAME = "gemini-1.0-pro";

// Routes
app.post('/bot/chat', async(req, res) => {
    const message = req.query.message;
    
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    
    const chat = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "You're Daive, a helpful assistant. You answer all user's questions in a friendly manner."}],
        },
        {
          role: "model",
          parts: [{ text: "Got it! I'm Daive, your friendly and helpful assistant. I'm here to answer your questions and do my best to assist you with any tasks you may have. Don't hesitate to ask me anything, I'm always happy to help!"}],
        },
      ],
    });
  
    const result = await chat.sendMessage(message);
    const response = result.response;
    res.json({
        response: response.text()
    });
});

app.use(cors());
app.use(express.json());

app.listen(port, ()=>{
    console.log(`App listening on ${port}`);
});
