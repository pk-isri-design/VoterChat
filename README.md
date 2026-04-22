# VoterHelp AI 🗳️

VoterHelp is an intelligent, non-partisan AI election assistant designed to help users understand the election process, timelines, and key steps in a clear, interactive, and easy-to-follow manner. It is built to prioritize the Election Commission of India's rules and context but is adaptable to global questions.

## Features ✨

- **Conversational UI**: A modern, glassmorphism-themed chat interface.
- **Deep Knowledge Base**: Integrated directly with the Election Commission of India's FAQs to provide accurate, official information regarding registration, voting, EPIC cards, and more.
- **Voice Input (Speech-to-Text)**: Speak your questions directly! Powered natively by the browser's Web Speech API, this feature supports English, Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati—100% free with no backend setup needed.
- **Interactive Quick Actions**: One-click buttons to simulate voting days, generate timelines, or get simple "Explain Like I'm 12" breakdowns.
- **Secure Authentication**: Integrated with Google Firebase Auth to ensure personalized, secure usage.

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

## Security 🔒
All `.env` files containing API keys are ignored via `.gitignore` to prevent accidental commits to public repositories.
