const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function verifyKnowledgeBase() {
  const API_KEY = process.env.GEMINI_API_KEY;
  console.log("Starting verification process...");
  
  if (!API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing from environment variables.");
    console.log("Please ensure you have added it to GitHub Secrets as 'GEMINI_API_KEY'.");
    process.exit(1);
  }

  const kbPath = path.join(__dirname, "../backend/knowledge_base.txt");
  const currentKB = fs.readFileSync(kbPath, "utf8");

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Robust fallback logic for different environments
  const modelsToTry = [
    process.env.GEMINI_MODEL, // 1. User defined
    "gemini-1.5-flash",       // 2. Fast/Modern
    "gemini-1.5-pro",         // 3. Smart/Modern
    "gemini-1.0-pro",         // 4. Stable Fallback (Recommended for CI)
  ].filter(Boolean);

  let model;
  let successfulModelName = "";

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting to use model: ${modelName} on API v1...`);
      // Explicitly force 'v1' to avoid the v1beta 404 issue in CI
      const tempModel = genAI.getGenerativeModel({ model: modelName }, { apiVersion: "v1" });
      
      // Test the model with a simple prompt to verify connectivity
      await tempModel.generateContent("ping");
      
      model = tempModel;
      successfulModelName = modelName;
      console.log(`✅ Successfully connected using ${modelName} on API v1`);
      break;
    } catch (e) {
      console.warn(`⚠️ Model ${modelName} failed on API v1. Reason: ${e.message}`);
    }
  }

  if (!model) {
    console.error("❌ ERROR: All attempted models failed. Please check your API key permissions and regional availability.");
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

    if (updatedKB && updatedKB.length > currentKB.length * 0.5) {
      // Add a hidden timestamp to ensure a commit happens during the test phase
      const finalKB = updatedKB.trim() + `\n\n[Last Verified: ${new Date().toISOString()}]`;
      
      fs.writeFileSync(kbPath, finalKB);
      console.log("Knowledge base successfully updated.");
      
      // Also update the functions folder copy
      const functionsKBPath = path.join(__dirname, "../frontend/functions/knowledge_base.txt");
      if (fs.existsSync(functionsKBPath)) {
        fs.writeFileSync(functionsKBPath, updatedKB);
        console.log("Functions knowledge base successfully updated.");
      }
    } else {
      console.error("Received an invalid or truncated response from the AI.");
    }
  } catch (error) {
    console.error("Error during verification:", error);
    process.exit(1);
  }
}

verifyKnowledgeBase();
