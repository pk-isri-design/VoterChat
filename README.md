# VoterHelp AI 🗳️

VoterHelp is an intelligent, non-partisan AI election assistant designed to help users understand the election process, timelines, and key steps in a clear, interactive, and easy-to-follow manner. It is built to prioritize the Election Commission of India's rules and context but is adaptable to global questions.

## Features ✨

- **Conversational UI**: A modern, glassmorphism-themed chat interface.
- **Deep Knowledge Base**: Integrated directly with the Election Commission of India's FAQs to provide accurate, official information regarding registration, voting, EPIC cards, and more.
- **Voice Input (Speech-to-Text)**: Speak your questions directly! Powered natively by the browser's Web Speech API, this feature supports English, Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati—100% free with no backend setup needed. Includes a smart 3-second auto-send pause detection.
- **Voice Output (Text-to-Speech)**: The AI can read its answers aloud directly in your selected regional language using advanced chunking to prevent browser timeouts.
- **Accessibility Settings**: Easily increase or decrease the chat text size with the built-in dynamic font resizer for better readability.
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

## Tech Stack 🛠️

- **Frontend**: React.js (Vite), CSS3 (Custom Glassmorphism styling), Axios, Lucide-React
- **Backend**: Node.js, Express
- **AI Model**: Google Gemini Flash via `@google/generative-ai`
- **Authentication**: Firebase Authentication

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

## Security 🔒
All `.env` files containing API keys are ignored via `.gitignore` to prevent accidental commits to public repositories.
