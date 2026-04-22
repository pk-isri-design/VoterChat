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
app.use(cors());
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
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest", 
      systemInstruction: SYSTEM_PROMPT 
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 8192,
      },
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Flush headers to start the stream immediately
    res.flushHeaders();

    const result = await chat.sendMessageStream(message);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error("Error generating response:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate response. Please try again later." });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted due to an error." })}\n\n`);
      res.end();
    }
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
