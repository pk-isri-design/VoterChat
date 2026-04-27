# VoterHelp AI 🗳️

VoterHelp is an intelligent, non-partisan AI election assistant designed to help users understand the election process, timelines, and key steps in a clear, interactive, and easy-to-follow manner. It is built to prioritize the Election Commission of India's rules and context but is adaptable to global questions.

## Features ✨

- **Conversational UI**: A modern, glassmorphism-themed chat interface.
- **Deep Knowledge Base**: Integrated directly with the Election Commission of India's FAQs to provide accurate, official information regarding registration, voting, EPIC cards, and more.
- **Voice Input (Speech-to-Text)**: Speak your questions directly! Powered natively by the browser's Web Speech API, this feature supports English, Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati—100% free with no backend setup needed. Includes a smart 3-second auto-send pause detection.
- **Voice Output (Text-to-Speech)**: The AI can read its answers aloud directly in your selected regional language using advanced chunking to prevent browser timeouts.
- **Accessibility Settings**: Global text zoom control. Easily increase or decrease the entire application's font size (Login, Timeline, Quiz, and Chat) with a single click.
- **Election Timeline 🗳️**: A comprehensive, 7-phase interactive guide to the Indian election process. Features static, high-quality content that works offline and includes:
  - **Key Fact Banners**: Quick insights into each phase.
  - **Detailed Breakdowns**: What Happens, Key Authorities, Rules, and "Did You Know" sections.
  - **Multilingual Support**: Fully translated into all 7 supported languages.
  - **Listen Mode**: Each section has a dedicated TTS button to read the content aloud in your local language.
- **Quiz Mode 🎯**: Test your election knowledge with situational challenges.
  - **30-Question Bank**: A pool of real-life scenarios (e.g., "What if I moved cities?").
  - **Randomized Sessions**: 5 random questions per attempt to keep it engaging.
  - **Instant Feedback**: Score tracking and review screens to help you learn from mistakes.
  - **Multilingual UI**: The quiz is fully playable in all 7 supported languages.
- **High Contrast (Dark) Mode**: Toggle a fully accessible high-contrast theme from the header. In this mode:
  - AI answer bubbles switch to a **yellow background with black text** for maximum legibility.
  - All **Quick Action tabs** (Register, Forms, etc.) and the **Language selector** tab display with a yellow background and black text, consistent with the high-contrast palette.
  - The **Listen / Stop** audio button inside answer bubbles and **Timeline sections** inverts to a **black background with yellow text** so it remains clearly visible against high-contrast backgrounds.
  - Focus indicators, gradient text, and form controls are all remapped to WCAG-safe contrast ratios.
- **Auto-Linked ECI Forms**: Whenever the AI mentions an official form (like Form 6 or Form 8), it automatically converts it into a highlighted, clickable link pointing directly to the ECI forms portal.
- **Progressive Web App (PWA)**: Fully installable on mobile and desktop for a native app-like experience.
- **Interactive Quick Actions**: One-click scrolling tabs for instant step-by-step guides on:
  - Download Forms (direct link to official portal)
  - Register as Voter
  - Missing from List (SIR)
  - Correct Address
  - Change Constituency
  - How to use this app
- **Authentication**: Secure Google Firebase Auth, along with a newly added **Guest Login** feature that lets users access election information entirely anonymously.
- **Firebase Cloud Functions**: Heavy AI processing is handled by scalable serverless functions, keeping the frontend lightweight.
- **Granular Security Rules**: Strict Firestore security rules ensure data integrity and prevent unauthorized access.
- **Engagement Analytics**: Integrated Google Analytics for Firebase to track user journeys, quiz completions, and chat interactions.
- **Monthly Auto-Updation**: A GitHub Action automatically audits and updates the knowledge base on the 2nd of every month using Gemini AI to ensure compliance with the latest ECI regulations.

## Automated Audit Workflow 🤖

To ensure that **VoterHelp** remains the most accurate election assistant in India, we have implemented a "Self-Healing" knowledge base system:

- **Schedule**: On the **2nd of every month**, a GitHub Action automatically triggers a deep audit of the knowledge base.
- **AI-Driven Verification**: The system leverages **Gemini 2.5 Flash** to compare the current app data against the latest official ECI regulations (as of 2026).
- **Auto-Deployment**: If the AI identifies outdated rules or new procedures, it automatically:
  1.  Updates the `knowledge_base.txt` files in both the backend and cloud functions.
  2.  Commits the changes back to the repository with a timestamp.
  3.  Triggers a fresh **Firebase Deployment** to push the updates live to [voterhelp-60466.web.app](https://voterhelp-60466.web.app).

This ensures that users always receive the most up-to-date and legally compliant election information without any manual intervention.

## Tech Stack 🛠️

- **Frontend**: React.js (Vite 8), CSS3 (Custom Glassmorphism styling), Axios, Lucide-React
- **Backend**: Node.js, Express
- **AI Model**: Google Gemini 2.5 Flash via `@google/generative-ai`
- **Authentication**: Firebase Authentication
- **CI/CD**: GitHub Actions & Firebase Hosting

## Project Structure 📁

- `/frontend` - The React application
- `/backend` - The Express server and AI integration layer

## Getting Started 🚀

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your Gemini API Key:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:
```bash
npm start
# or 
node index.js
```
The backend will run on `http://localhost:3001`.

### 2. Setup the Frontend
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the Vite development server:
```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser to interact with VoterHelp AI!

## Testing 🧪
The frontend is fully tested using **Vitest** and **React Testing Library**. It includes tests for:
- Microphone activation and SpeechRecognition API mocks.
- Text-to-Speech (TTS) consistency and language matching.
- Multi-language UI changes.
- Authentication states.

To run the test suite:
```bash
cd frontend
npm run test
```

## Security & Data Integrity 🔒

### 1. Firebase Security Rules
The application uses strict, granular security rules for Firestore to ensure that user data is protected:
- **User Privacy**: Users can only read and write to their own specific document in the `/users/{userId}` collection.
- **Chat History**: Access to the `/chat_sessions` collection is restricted to the authenticated owner of the session.
- **Public Lockdown**: All other collections and documents are locked for public read/write access by default.

### 2. Automated Knowledge Base Audit
To ensure that election procedures (like qualifying dates and State/UT counts) are always accurate:
- **Schedule**: A GitHub Action runs on the **2nd of every month**.
- **AI Verification**: The workflow executes `scripts/verify_kb.js`, which uses the Gemini 1.5 Flash model to audit `knowledge_base.txt` against current ECI standards.
- **Auto-Sync**: Updated data is automatically committed back to the repository and synced with the Firebase Cloud Functions layer.

## Analytics & Engagement 📊

VoterHelp uses **Google Analytics for Firebase** to monitor platform health and user education metrics.
- **Tracked Events**:
  - `chat_message_sent`: Monitors language preferences and input methods (voice vs. text).
  - `quiz_started` & `quiz_completed`: Tracks user progress and election knowledge scores.
  - `timeline_listen`: Monitors usage of the Text-to-Speech feature across different phases.

---
*VoterHelp AI is a non-partisan educational tool and is not officially affiliated with the Election Commission of India.*
