import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import { logout, logCustomEvent } from '../firebase';
import { Send, LogOut, Loader2, Sparkles, User, Info, Trash2, Mic, MicOff, Globe, Volume2, Square, Type, Minus, Plus, Moon, Sun, MessageCircle, Clock, Gamepad2 } from 'lucide-react';
import { translations } from '../utils/translations';
import TimelineMode from './TimelineMode';
import QuizMode from './QuizMode';

export default function ChatInterface({ user }) {
  const [appLanguage, setAppLanguage] = useState('en-IN');
  const [appMode, setAppMode] = useState('chat'); // 'chat' | 'timeline' | 'quiz'
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

  // Apply zoom to the entire page by changing the CSS root font-size.
  // All rem-based sizes across the app (CSS, inline styles, all components) scale with it.
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeMultiplier * 100}%`;
    return () => {
      // Reset to default when component unmounts (e.g. logout)
      document.documentElement.style.fontSize = '';
    };
  }, [fontSizeMultiplier]);

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
    <div className={highContrast ? "high-contrast-mode" : ""} style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      {/* Header & Mode Switcher (Grok Style Upper Middle) */}
      <header className="glass chat-header" style={{ 
        padding: '12px 20px', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '12px',
        margin: '10px 10px 0 10px', 
        borderRadius: 'var(--radius-lg)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles color="var(--primary)" />
            <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.1rem' }}>VoterHelp</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="header-controls" style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.03)', borderRadius: '999px', padding: '2px' }}>
              <button onClick={() => setHighContrast(!highContrast)} className="icon-btn" title="Toggle Contrast"><Moon size={14} /></button>
              <button onClick={handleDecreaseText} className="icon-btn" title="Small text"><Minus size={14} /></button>
              <button onClick={handleIncreaseText} className="icon-btn" title="Large text"><Plus size={14} /></button>
            </div>
            <button onClick={logout} className="logout-btn" title="Logout"><LogOut size={18} /></button>
          </div>
        </div>

        {/* Centralized Mode Pill */}
        <div className="mode-pill-container" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="mode-pill">
            {[
              { id: 'chat',     label: '🧠 Ask AI' },
              { id: 'timeline', label: '🗳️ Timeline' },
              { id: 'quiz',     label: '🎯 Quiz' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`mode-pill-tab ${appMode === tab.id ? 'active' : ''}`}
                onClick={() => setAppMode(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {appMode === 'chat' && (
          <div className="chat-area" style={{ flex: 1, overflowY: 'auto', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.length === 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }} className="animate-fade-in">
                <img src="/chat_timeline_graphic.png" alt="Election Timeline" className="welcome-img" style={{ width: '90%', maxWidth: '600px', height: 'auto', opacity: 0.8, borderRadius: 'var(--radius-md)' }} />
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} style={{ display: 'flex', gap: '12px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }} className="animate-fade-in">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.role === 'user' ? 'var(--primary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px' }}>
                  {msg.role === 'user' ? <User size={16} color="white" /> : <Info size={16} color="white" />}
                </div>
                <div className={`chat-bubble ${msg.role}`} style={{
                  background: msg.role === 'user' ? 'white' : 'rgba(255, 255, 255, 0.9)',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                  borderBottomLeftRadius: msg.role === 'user' ? '18px' : '4px',
                  maxWidth: '85%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  {msg.role === 'user' ? (
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{msg.parts[0].text}</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="markdown-body" style={{ fontSize: '0.95rem' }} dangerouslySetInnerHTML={{ __html: marked(msg.parts[0].text) }} />
                      <button 
                        className="listen-btn"
                        onClick={() => playMessage(msg.parts[0].text, index)}
                        style={{
                          marginTop: '10px',
                          background: 'rgba(0,0,0,0.03)',
                          border: 'none',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.75rem',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          alignSelf: 'flex-start',
                          fontWeight: '600'
                        }}
                      >
                        {playingIndex === index ? <Square size={12} fill="currentColor" /> : <Volume2 size={12} />}
                        {playingIndex === index ? 'Stop' : 'Listen'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {appMode === 'timeline' && <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}><TimelineMode appLanguage={appLanguage} /></div>}
        {appMode === 'quiz' && <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}><QuizMode appLanguage={appLanguage} /></div>}

        {/* Quick Bytes (Floating suggestion tabs) */}
        {appMode === 'chat' && (
          <div className="quick-bytes-container" style={{
            position: 'absolute',
            bottom: '80px',
            left: 0,
            right: 0,
            padding: '0 10px',
            zIndex: 5
          }}>
            <div className="quick-bytes-scroll hide-scrollbar" style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '5px'
            }}>
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className="quick-byte-btn"
                  onClick={() => handleStaticTabClick(tab)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer (Input Bar) */}
      {appMode === 'chat' && (
        <footer className="chat-footer" style={{ 
          padding: '10px', 
          background: 'white',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <div className="lang-pill" style={{
              background: 'var(--primary)',
              borderRadius: '999px',
              padding: '0 10px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'white'
            }}>
              <Globe size={14} />
              <select
                value={appLanguage}
                onChange={(e) => setAppLanguage(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
              >
                <option value="en-IN">EN</option>
                <option value="hi-IN">हि</option>
                <option value="bn-IN">বা</option>
                <option value="ta-IN">த</option>
                <option value="te-IN">తె</option>
                <option value="mr-IN">म</option>
                <option value="gu-IN">ગુ</option>
              </select>
            </div>

            <div className="input-container" style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: '#f1f5f9',
              borderRadius: '999px',
              padding: '0 12px',
              height: '44px'
            }}>
              <button onClick={toggleListening} style={{ background: 'transparent', border: 'none', color: isListening ? '#ef4444' : '#64748b', display: 'flex', alignItems: 'center' }}>
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={translations[appLanguage].askPlaceholder}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '0 10px', fontSize: '0.9rem', color: 'var(--text-main)' }}
              />
              <button 
                onClick={() => handleSend()} 
                disabled={loading || !input.trim()}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (loading || !input.trim()) ? 0.5 : 1 }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
