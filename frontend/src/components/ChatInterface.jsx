import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import { logout } from '../firebase';
import { Send, LogOut, Loader2, Sparkles, User, Info, Trash2, Mic, MicOff, Globe, Volume2, Square, Type, Minus, Plus, Moon, Sun } from 'lucide-react';
import { translations } from '../utils/translations';

export default function ChatInterface({ user }) {
  const [appLanguage, setAppLanguage] = useState('en-IN');
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: translations['en-IN'].welcome }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [speechTrigger, setSpeechTrigger] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const speechChunksRef = useRef([]);

  useEffect(() => {
    const loadVoices = () => {
      setAvailableVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

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
  
  useEffect(() => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length === 1 && newMessages[0].role === 'model') {
        newMessages[0].parts[0].text = translations[appLanguage].welcome;
      }
      return newMessages;
    });
  }, [appLanguage]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setInput(finalTranscript);

        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        
        speechTimeoutRef.current = setTimeout(() => {
          recognitionRef.current?.stop();
          setIsListening(false);
          setSpeechTrigger(finalTranscript);
        }, 3000);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        recognitionRef.current.lang = appLanguage;
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support Speech Recognition.");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textOverride, isVoiceCommand = false) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', parts: [{ text: textToSend }] }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Format history for Gemini API (only user/model roles allowed)
      const history = messages
        .filter(msg => msg.parts && msg.parts[0] && msg.parts[0].text.trim() !== "")
        .map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: msg.parts
        }));

      // Gemini requires the history to start with a 'user' message. 
      // Remove our hardcoded welcome message from the history context.
      if (history.length > 0 && history[0].role === 'model') {
        history.shift();
      }

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiBase}/api/chat`, {
        message: textToSend,
        history: history,
        language: appLanguage
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

  const handleQuickAction = (action) => {
    let text = "";
    if (action === 'timeline') text = "Show me a typical election timeline.";
    if (action === 'explain12') text = "Explain the voting process like I'm 12 years old.";
    if (action === 'simulate') text = "Let's simulate my role as a first-time voter. What are my steps?";
    handleSend(text);
  };

  const clearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speechChunksRef.current = [];
    setPlayingIndex(null);
    setMessages([
      { role: 'model', parts: [{ text: translations[appLanguage].welcome }] }
    ]);
  };

  const tabs = translations[appLanguage].tabs;

  const handleStaticTabClick = (tab) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speechChunksRef.current = [];
    setPlayingIndex(null);
    // Instantly append the user's implicit question and the static response
    setMessages(prev => [
      ...prev,
      { role: 'user', parts: [{ text: tab.label }] },
      { role: 'model', parts: [{ text: tab.response }] }
    ]);
    scrollToBottom();
  };

  const playNextChunk = () => {
    if (speechChunksRef.current.length === 0) {
      setPlayingIndex(null);
      return;
    }
    
    const chunk = speechChunksRef.current.shift();
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = appLanguage;
    
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) voices = availableVoices;
    const langPrefix = appLanguage.split('-')[0];
    const voice = voices.find(v => v.lang === appLanguage) || 
                  voices.find(v => v.lang.startsWith(langPrefix)) ||
                  voices.find(v => v.name.toLowerCase().includes(langPrefix));
                  
    if (voice) utterance.voice = voice;
    
    utterance.onend = () => {
      playNextChunk();
    };
    
    utterance.onerror = (e) => {
      console.error("Speech chunk error", e);
      if (e.error !== 'interrupted') {
        setPlayingIndex(null);
        speechChunksRef.current = [];
      }
    };
    
    window.speechSynthesis._utterance = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const playMessage = (text, index) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speechChunksRef.current = [];
    
    if (playingIndex === index) {
      setPlayingIndex(null);
      return;
    }

    setPlayingIndex(index);
    const cleanText = text.replace(/[*#]/g, '');
    const chunks = cleanText.match(/[^.!?।\n]+[.!?।\n]*/g) || [cleanText];
    
    speechChunksRef.current = chunks.map(c => c.trim()).filter(c => c.length > 0);
    playNextChunk();
  };

  const handleIncreaseText = () => setFontSizeMultiplier(prev => Math.min(prev + 0.1, 1.5));
  const handleDecreaseText = () => setFontSizeMultiplier(prev => Math.max(prev - 0.1, 0.8));

  return (
    <div className={highContrast ? "high-contrast-mode" : ""} style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontSize: `${fontSizeMultiplier}rem` }}>
      {/* Header */}
      <header className="glass chat-header" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 20px 0 20px', borderRadius: '16px 16px 0 0', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="var(--primary)" />
          <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.2rem' }}>VoterHelp</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)', padding: '2px', marginRight: '10px' }}>
            <button onClick={() => setHighContrast(!highContrast)} style={{ background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', marginRight: '5px' }} title="Toggle High Contrast" aria-label="Toggle High Contrast">
              {highContrast ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={handleDecreaseText} style={{ background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }} title="Decrease text size" aria-label="Decrease text size"><Minus size={16} /></button>
            <Type size={16} color="var(--text-main)" style={{ margin: '0 5px' }} aria-hidden="true" />
            <button onClick={handleIncreaseText} style={{ background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }} title="Increase text size" aria-label="Increase text size"><Plus size={16} /></button>
          </div>
          <span className="header-username" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.displayName || user.email}</span>
          <button onClick={() => {
            logout();
            if (user.isGuest) window.location.reload();
          }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Logout" aria-label="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Static Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        padding: '15px 20px',
        margin: '0 20px',
        overflowX: 'auto',
        background: 'rgba(255, 255, 255, 0.4)',
        borderLeft: '1px solid var(--glass-border)',
        borderRight: '1px solid var(--glass-border)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }} className="hide-scrollbar chat-tabs">
        <div className="tab-btn" style={{ 
            display: 'flex', alignItems: 'center', gap: '5px', 
            background: 'var(--primary)', color: 'white', 
            borderRadius: 'var(--radius-md)', padding: '0 10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
          <Globe size={16} />
          <select
            value={appLanguage}
            onChange={(e) => setAppLanguage(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.85rem'
            }}
            title="Change App Language"
            aria-label="Change App Language"
          >
            <option value="en-IN" style={{ color: 'black' }}>English</option>
            <option value="hi-IN" style={{ color: 'black' }}>हिन्दी</option>
            <option value="bn-IN" style={{ color: 'black' }}>বাংলা</option>
            <option value="ta-IN" style={{ color: 'black' }}>தமிழ்</option>
            <option value="te-IN" style={{ color: 'black' }}>తెలుగు</option>
            <option value="mr-IN" style={{ color: 'black' }}>मराठी</option>
            <option value="gu-IN" style={{ color: 'black' }}>ગુજરાતી</option>
          </select>
        </div>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className="btn-secondary tab-btn"
            onClick={() => handleStaticTabClick(tab)}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
              background: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="glass-panel chat-area" style={{ flex: 1, margin: '0 20px', borderRadius: '0', borderTop: 'none', borderBottom: 'none', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.length === 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }} className="animate-fade-in">
            <img src="/chat_timeline_graphic.png" alt="Election Timeline" className="welcome-img" style={{ width: '100%', maxWidth: '900px', height: 'auto', objectFit: 'contain', opacity: 0.95, borderRadius: 'var(--radius-md)' }} />
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', gap: '15px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }} className="animate-fade-in">
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: msg.role === 'user' ? 'var(--primary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {msg.role === 'user' ? <User size={20} color="white" /> : <Info size={20} color="white" />}
            </div>
            <div className="chat-bubble" style={{
              background: msg.role === 'user' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(255, 255, 255, 0.8)',
              padding: '15px 20px',
              borderRadius: 'var(--radius-md)',
              maxWidth: '75%',
              border: `1px solid ${msg.role === 'user' ? 'rgba(217, 119, 6, 0.3)' : 'var(--glass-border)'}`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
              {msg.role === 'user' ? (
                <p style={{ margin: 0 }}>{msg.parts[0].text}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked(msg.parts[0].text) }} />
                  <button 
                    onClick={() => playMessage(msg.parts[0].text, index)}
                    title={playingIndex === index ? "Stop playing" : "Read aloud"}
                    style={{
                      marginTop: '15px',
                      background: playingIndex === index ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      border: `1px solid ${playingIndex === index ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                      color: playingIndex === index ? '#ef4444' : '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      alignSelf: 'flex-start',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {playingIndex === index ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
                    {playingIndex === index ? 'Stop' : 'Listen'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Loader2 className="animate-spin" size={20} color="white" />
            </div>
            <div style={{ padding: '15px', color: 'var(--text-muted)' }}>{translations[appLanguage].thinking}</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="glass chat-footer" style={{ padding: '20px', margin: '0 20px 20px 20px', borderRadius: '0 0 16px 16px' }}>
        <div className="footer-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={clearChat}
            title="Clear Chat"
            aria-label="Clear Chat"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0 15px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Trash2 size={20} />
          </button>

          <button
            className="btn-secondary"
            onClick={toggleListening}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 15px',
              height: '46px',
              background: isListening ? 'rgba(239, 68, 68, 0.1)' : '#ffffff',
              color: isListening ? '#ef4444' : 'var(--text-main)',
              border: `1px solid ${isListening ? 'rgba(239, 68, 68, 0.4)' : '#cbd5e1'}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              flexShrink: 0
            }}
            title={isListening ? "Stop listening" : "Start speaking"}
            aria-label={isListening ? "Stop listening" : "Start speaking"}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            className="footer-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={translations[appLanguage].askPlaceholder}
            aria-label="Chat input"
            style={{
              flex: 1,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-md)',
              padding: '0 15px',
              height: '46px',
              color: 'var(--text-main)',
              outline: 'none',
              fontSize: '1rem',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
          <button
            className="btn-primary"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 20px',
              height: '46px',
              opacity: (loading || !input.trim()) ? 0.5 : 1,
              flexShrink: 0
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
