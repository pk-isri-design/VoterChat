const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// Initialize Gemini
let API_KEY = process.env.GEMINI_API_KEY;
try {
  const config = functions.config();
  if (config && config.gemini) {
    API_KEY = API_KEY || config.gemini.key;
  }
} catch (e) {
  // Silent catch for local deployment analysis
}

// Read knowledge base
let knowledgeBase = "";
try {
  knowledgeBase = fs.readFileSync(path.join(__dirname, "knowledge_base.txt"), "utf8");
} catch (e) {
  console.log("No knowledge base found in functions folder.");
}

const SYSTEM_PROMPTS = {
  chat: `You are VoterHelp, an intelligent, user-friendly, non-partisan assistant designed to help users understand the election process globally.
Core rules:
1. Explain complex election procedures in simple, conversational language.
2. Guide users step-by-step through the election lifecycle.
3. Always remain neutral, objective, and non-partisan.
4. If a user asks for localized information, adapt your explanation to that region's rules.
5. Keep responses concise, well-structured.
6. Provide definitions for key terms when used.
7. If no country is mentioned, assume India.
8. Assume the context is about an election.

Knowledge base:
${knowledgeBase}`
};

exports.chatWithAI = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { message, history, language, mode } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!API_KEY) {
        return res.status(500).json({ error: "Gemini API key not configured in Cloud Functions." });
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const chat = model.startChat({
        history: history || [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      // Inject system prompt as a 'user' message if history is empty, 
      // or use a more advanced system instruction if supported by the SDK version.
      const prompt = history && history.length > 0 
        ? message 
        : `${SYSTEM_PROMPTS.chat}\n\nUser Question: ${message}`;

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      return res.json({ text });
    } catch (error) {
      console.error("Cloud Function Error:", error);
      return res.status(500).json({ error: error.message });
    }
  });
});
