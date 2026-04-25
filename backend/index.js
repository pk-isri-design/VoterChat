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

const SYSTEM_PROMPTS = {
  chat: `You are VoterHelp, an intelligent, user-friendly, non-partisan assistant designed to help users understand the election process globally.
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
</knowledge_base>`,

  timeline: `You are an educator explaining the timeline of Indian elections in a structured, step-by-step way.

You will receive a request about a specific phase of the election process, or a request to explain a phase more simply, or a request for a real example.

Always structure your response in clear markdown with:
- A bold heading for the phase name
- What happens in this phase
- Key authorities involved
- Important rules or deadlines
- Any interesting facts

Keep responses educational, structured, concise, and easy to follow. Assume the context is Indian general elections unless specified otherwise.

When generating responses, use Markdown format with headings, bullet points and bold text for scannability.`,

  quiz: `You are a quiz master for Indian elections.

Generate one multiple-choice question at a time in the following STRICT JSON format (no extra text, no markdown, only valid JSON):
{
  "question": "The question text here",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctIndex": 0,
  "explanation": "Short explanation of why the answer is correct"
}

Rules:
- correctIndex is 0-based (0=A, 1=B, 2=C, 3=D)
- Mix difficulty levels: easy, medium, hard
- Cover topics: voter rights, EVMs, Election Commission, election phases, constitutional provisions, historical elections, Model Code of Conduct
- Questions must be clear, unambiguous, and factually accurate
- Each call generates a DIFFERENT question. Avoid repeating questions.
- Do NOT include any text outside the JSON object`
};

// Keep backward-compat alias
const SYSTEM_PROMPT = SYSTEM_PROMPTS.chat;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, language, mode } = req.body;

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
    const basePrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat;
    const dynamicSystemPrompt = basePrompt + `\n\nLanguage rule: You MUST respond in ${langName}. Do not respond in English if the user asked in another language.\nForm links rule: If you mention any official form (e.g., Form 6, Form 7, Form 8, Form 9, Form 6A, Form 8A, etc.), format it as a markdown link pointing to https://voters.eci.gov.in/home/forms.`;
    // For quiz mode, override to always respond in English JSON regardless of language
    const effectivePrompt = mode === 'quiz' ? basePrompt : dynamicSystemPrompt;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: effectivePrompt
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
