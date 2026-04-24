import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'https://voterhelp-60466.web.app',
    'https://voterhelp-60466.firebaseapp.com',
    'http://localhost:5173'
  ]
}));
app.use(express.json());

const port = process.env.PORT || 3001;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Read knowledge base
let knowledgeBase = "";
try {
  knowledgeBase = fs.readFileSync(path.join(__dirname, 'knowledge_base.txt'), 'utf8');
} catch (e) {
  console.log("No knowledge base found.");
}

const SYSTEM_PROMPT = `You are VoterHelp, an intelligent, user-friendly, non-partisan assistant designed to help users understand the election process globally. 
Core rules:
1. Explain complex election procedures in simple, conversational language.
2. Guide users step-by-step through the election lifecycle (registration -> campaigning -> voting -> counting -> results).
3. Always remain neutral, objective, and non-partisan. Never show bias, endorse candidates/parties, or provide political opinions.
4. If a user asks for localized information (e.g., "India", "US", "UK"), adapt your explanation to that region's rules.
5. Keep responses concise, well-structured, using bullet points, numbered steps, or markdown tables.
6. Provide definitions for key terms when used (e.g., EVM, ballot, constituency).
7. If no country is mentioned in the question, assume the country to be India.
8. Every time, assume the context of the user's question is about an election.

When generating responses, use Markdown format. Do NOT wrap your entire response in markdown code blocks unless it's a specific code snippet.

Here is your knowledge base containing FAQs from the Election Commission of India. Use this knowledge base to answer user queries accurately:
<knowledge_base>
${knowledgeBase}
</knowledge_base>`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const languageMap = {
      'en-IN': 'English',
      'hi-IN': 'Hindi',
      'bn-IN': 'Bengali',
      'ta-IN': 'Tamil',
      'te-IN': 'Telugu',
      'mr-IN': 'Marathi',
      'gu-IN': 'Gujarati'
    };
    const langName = languageMap[language] || 'the same language as the user query';
    const dynamicSystemPrompt = SYSTEM_PROMPT + `\n9. You MUST respond in ${langName}. Do not respond in English if the user asked in another language.\n10. If you mention any official form, you MUST format it as a markdown link pointing directly to its official PDF download URL. Do this consistently across all languages. Here is the mapping you must use:
- Form 6: [Form 6](https://www.eci.gov.in/eci_main/forms/FORM6.pdf)
- Form 6A: [Form 6A](https://www.eci.gov.in/eci_main/forms/FORM6A.pdf)
- Form 7: [Form 7](https://www.eci.gov.in/eci_main/forms/FORM7.pdf)
- Form 8: [Form 8](https://www.eci.gov.in/eci_main/forms/FORM8.pdf)
- Form 8A: [Form 8A](https://www.eci.gov.in/eci_main/forms/FORM8A.pdf)
- Form 13F: [Form 13F](https://www.eci.gov.in/eci_main/forms/FORM13F.pdf)
- Form 17: [Form 17](https://www.eci.gov.in/eci_main/forms/FORM17.pdf)
- Form 18: [Form 18](https://www.eci.gov.in/eci_main/forms/FORM18.pdf)
- Form 19: [Form 19](https://www.eci.gov.in/eci_main/forms/FORM19.pdf)
- Form 22: [Form 22](https://www.eci.gov.in/eci_main/forms/FORM22.pdf)
- Form 26: [Form 26](https://www.eci.gov.in/eci_main/forms/FORM26.pdf)`;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: dynamicSystemPrompt
    });

    const cleanHistory = (history || []).filter(msg => msg.parts && msg.parts[0] && msg.parts[0].text.trim() !== "");

    const chat = model.startChat({
      history: cleanHistory,
      generationConfig: {
        maxOutputTokens: 8192,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    res.json({ text: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate response. Please try again later." });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
