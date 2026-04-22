import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const models = await genAI.getModels();
    console.log("Available Models:");
    models.forEach((model) => console.log(model.name));
  } catch (error) {
    console.error("Failed:", error);
  }
}
run();
