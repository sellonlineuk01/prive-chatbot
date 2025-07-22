const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const systemPrompt = `
You are a helpful, professional AI assistant for a UK-based dental and medical clinic.
Only respond using UK NHS, NICE, or GDC guidance and content from Privé Clinics.
Do not diagnose conditions. Always suggest booking an appointment when unsure.
`;

  const response = await openai.createChatCompletion({
    model: "gpt-4o", // or "gpt-3.5-turbo" if you prefer
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  res.json({ reply: response.data.choices[0].message.content });
});

app.listen(3001, () => console.log("Server running on port 3001"));