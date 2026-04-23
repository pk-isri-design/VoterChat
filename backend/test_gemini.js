import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function testGeminiConnection() {
  console.log("Testing Gemini API connection...");
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY is not set in backend/.env");
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent("Say 'Hello, Gemini is connected!'");
    const response = await result.response;
    const text = response.text();
    
    if (text) {
      console.log("✅ Success! Gemini is connected.");
      console.log("Response:", text);
    } else {
      console.log("⚠️ Warning: Received empty response from Gemini.");
    }
  } catch (error) {
    console.error("❌ Failed to connect to Gemini API.");
    console.error("Error details:", error.message);
    process.exit(1);
  }
}

testGeminiConnection();
