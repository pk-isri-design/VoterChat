const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function verifyKnowledgeBase() {
  const API_KEY = process.env.GEMINI_API_KEY;
  const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  
  console.log("Starting verification process...");
  
  if (!API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing.");
    process.exit(1);
  }

  const kbPath = path.join(__dirname, "../backend/knowledge_base.txt");
  const currentKB = fs.readFileSync(kbPath, "utf8");

  const genAI = new GoogleGenerativeAI(API_KEY);

  // Diagnostic: List authorized models via REST
  console.log("--- AUTHORIZED MODELS LIST ---");
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`);
    const data = await res.json();
    if (data.models) {
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("No models returned in list.");
    }
  } catch (e) {
    console.log(`Could not list models via REST: ${e.message}`);
  }
  console.log("------------------------------");

  let model;
  try {
    console.log(`Connecting to model: ${MODEL_NAME}`);
    model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Quick health check
    await model.generateContent("ping");
    console.log(`✅ Connected successfully to ${MODEL_NAME}`);
  } catch (e) {
    console.error(`❌ Model connection failed: ${e.message}`);
    process.exit(1);
  }

  const prompt = `You are an expert on Indian Election Law and ECI (Election Commission of India) procedures.
Your task is to verify and update the following Election Knowledge Base.

RULES:
1. Check each Question and Answer against the LATEST official information from ECI (as of 2026).
2. Pay special attention to:
   - Qualifying dates (now 4 dates: Jan 1, Apr 1, Jul 1, Oct 1).
   - State and UT counts (28 States, 8 UTs).
   - UTs with Legislative Assemblies (Delhi, Puducherry, J&K).
   - Abolition of Anglo-Indian nominated seats.
   - New online portals (voters.eci.gov.in).
3. If an answer is outdated, rewrite it accurately.
4. Maintain the "Q: ... Ans: ..." format.
5. Do NOT hallucinate. If a fact is uncertain, keep it as is but add a note.
6. Return the FULL updated knowledge base text.

Current Knowledge Base:
---
${currentKB}
---`;

  try {
    console.log("Sending KB to Gemini for verification...");
    const result = await model.generateContent(prompt);
    const updatedKB = result.response.text();

    if (updatedKB && updatedKB.length > 100) {
      // Add a hidden timestamp
      const finalKB = updatedKB.trim() + `\n\n[Last Verified: ${new Date().toISOString()}]`;
      
      fs.writeFileSync(kbPath, finalKB);
      console.log("Knowledge base successfully updated.");
      
      // Also update the functions folder copy
      const functionsKBPath = path.join(__dirname, "../frontend/functions/knowledge_base.txt");
      if (fs.existsSync(functionsKBPath)) {
        fs.writeFileSync(functionsKBPath, updatedKB);
      }
    } else {
      console.error("❌ ERROR: Received an invalid or empty response from the AI.");
    }
  } catch (error) {
    console.error("Error during verification:", error);
    process.exit(1);
  }
}

verifyKnowledgeBase();
