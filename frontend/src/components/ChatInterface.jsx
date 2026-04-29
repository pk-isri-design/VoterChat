import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import { logCustomEvent } from '../firebase';
import { translations } from '../utils/translations';

const TimelineMode = lazy(() => import('./TimelineMode'));
const QuizMode = lazy(() => import('./QuizMode'));
import ChatHeader from './ChatHeader';
import ModeSwitcher from './ModeSwitcher';
import QuickTabs from './QuickTabs';
import MessageList from './MessageList';
import ChatFooter from './ChatFooter';
import { useAccessibility } from '../hooks/useAccessibility';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function ChatInterface({ user }) {
  const [appLanguage, setAppLanguage] = useState('en-IN');
  const [appMode, setAppMode] = useState('chat'); // 'chat' | 'timeline' | 'quiz'
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: translations['en-IN'].welcome }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speechTrigger, setSpeechTrigger] = useState(null);
  
  const messagesEndRef = useRef(null);

  const {
    highContrast,
    setHighContrast,
    handleIncreaseText,
    handleDecreaseText
  } = useAccessibility();

  const {
    playingIndex,
    playMessage,
    cancelSpeech
  } = useSpeechSynthesis(appLanguage);

  const {
    isListening,
    toggleListening,
    setIsListening
  } = useSpeechRecognition(appLanguage, setInput, setSpeechTrigger);

  // Handle Speech Recognition Triggers
  useEffect(() => {
    if (speechTrigger) {
      const lowerCmd = speechTrigger.toLowerCase().trim();
      if (lowerCmd === "clear chat" || lowerCmd === "chat clear" || lowerCmd === "clear") {
        clearChat();
        setInput('');
      } else if (lowerCmd.includes("change language to hindi") || lowerCmd.includes("switch to hindi")) {
        setAppLanguage('hi-IN');
        setInput('');
      } else if (lowerCmd.includes("change language to english") || lowerCmd.includes("switch to english")) {
        setAppLanguage('en-IN');
        setInput('');
      } else {
        handleSend(speechTrigger, true);
      }
      setSpeechTrigger(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechTrigger]);
  
  // Handle Language Change
  useEffect(() => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length === 1 && newMessages[0].role === 'model') {
        newMessages[0].parts[0].text = translations[appLanguage]?.welcome || '';
      }
      return newMessages;
    });
  }, [appLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textOverride = null, isVoiceCommand = false) => {
    cancelSpeech();
    
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', parts: [{ text: textToSend }] }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Format history for Gemini API
      const history = messages
        .filter(msg => msg.parts && msg.parts[0] && msg.parts[0].text.trim() !== "")
        .map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: msg.parts
        }));

      if (history.length > 0 && history[0].role === 'model') {
        history.shift();
      }

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      logCustomEvent('chat_message_sent', {
        language: appLanguage,
        is_voice: isVoiceCommand
      });

      const response = await axios.post(`${apiBase}/api/chat`, {
        message: textToSend,
        history: history,
        language: appLanguage,
        mode: 'chat',
      });

      const responseText = response.data.text;
      
      const autoLinkForms = (text) => {
        return text.replace(/(\[.*?\]\(.*?\))|((?:Form|फॉर्म|ফর্ম|படிவம்|ఫారం|ફોર્મ|ഫോറം)\s*[0-9]+[A-Z]?)/gi, (match, existingLink, formMatch) => {
          if (existingLink) return existingLink;
          return `[${formMatch}](https://voters.eci.gov.in/home/forms)`;
        });
      };
      
      setMessages([...newMessages, { role: 'model', parts: [{ text: autoLinkForms(responseText) }] }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages([...newMessages, { role: 'model', parts: [{ text: "I'm sorry, I'm having trouble connecting to the server. Please try again later." }] }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = useCallback(() => {
    cancelSpeech();
    setMessages([
      { role: 'model', parts: [{ text: translations[appLanguage]?.welcome || '' }] }
    ]);
  }, [appLanguage, cancelSpeech]);

  const handleStaticTabClick = useCallback((tab) => {
    cancelSpeech();
    setMessages(prev => [
      ...prev,
      { role: 'user', parts: [{ text: tab.label }] },
      { role: 'model', parts: [{ text: tab.response }] }
    ]);
    scrollToBottom();
  }, [cancelSpeech]);

  return (
    <div className={highContrast ? "high-contrast-mode" : ""} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ChatHeader 
        user={user}
        appLanguage={appLanguage}
        setAppLanguage={setAppLanguage}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        handleDecreaseText={handleDecreaseText}
        handleIncreaseText={handleIncreaseText}
      />

      <ModeSwitcher appMode={appMode} setAppMode={setAppMode} />

      {appMode === 'chat' && (
        <QuickTabs 
          appLanguage={appLanguage} 
          handleStaticTabClick={handleStaticTabClick} 
        />
      )}

      {appMode === 'chat' ? (
        <MessageList 
          messages={messages}
          loading={loading}
          appLanguage={appLanguage}
          playingIndex={playingIndex}
          playMessage={playMessage}
          messagesEndRef={messagesEndRef}
        />
      ) : appMode === 'timeline' ? (
        <div className="glass-panel chat-area" style={{ flex: 1, margin: '0 20px', borderTop: 'none', borderBottom: 'none', overflowY: 'auto', padding: '20px' }}>
          <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>}>
            <TimelineMode appLanguage={appLanguage} />
          </Suspense>
        </div>
      ) : (
        <div className="glass-panel chat-area" style={{ flex: 1, margin: '0 20px', borderTop: 'none', borderBottom: 'none', overflowY: 'auto', padding: '20px' }}>
          <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>}>
            <QuizMode appLanguage={appLanguage} />
          </Suspense>
        </div>
      )}

      {appMode === 'chat' && (
        <ChatFooter 
          appLanguage={appLanguage}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          loading={loading}
          clearChat={clearChat}
          isListening={isListening}
          toggleListening={toggleListening}
        />
      )}
    </div>
  );
}
