import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import { logout } from '../firebase';
import { Send, LogOut, Loader2, Sparkles, User, Info, Trash2, Mic, MicOff } from 'lucide-react';

export default function ChatInterface({ user }) {
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Hello! I'm VoterHelp, your intelligent and non-partisan election assistant. How can I help you understand the election process today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState('en-IN');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
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
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = speechLanguage;
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

  const handleSend = async (textOverride) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', parts: [{ text: textToSend }] }];
    setMessages([...newMessages, { role: 'model', parts: [{ text: "" }] }]); // Placeholder for streaming response
    setInput('');
    setLoading(true);

    try {
      // Format history for Gemini API (only user/model roles allowed)
      const history = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: msg.parts
      }));
      
      // Gemini requires the history to start with a 'user' message. 
      // Remove our hardcoded welcome message from the history context.
      if (history.length > 0 && history[0].role === 'model') {
        history.shift();
      }

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history })
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Turn off loading animation as soon as first chunk arrives
        setLoading(false);
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) throw new Error(data.error);
              fullResponse += data.text;
              
              setMessages(currentMessages => {
                const updated = [...currentMessages];
                const lastIdx = updated.length - 1;
                if (updated[lastIdx].role === 'model') {
                  updated[lastIdx].parts[0].text = fullResponse;
                }
                return updated;
              });
            } catch (e) {
              console.error("Error parsing stream chunk", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx].role === 'model' && updated[lastIdx].parts[0].text === "") {
          updated[lastIdx].parts[0].text = "I'm sorry, I'm having trouble connecting to the server. Please try again later.";
        } else if (updated[lastIdx].role !== 'model') {
           updated.push({ role: 'model', parts: [{ text: "I'm sorry, I'm having trouble connecting to the server. Please try again later." }] });
        }
        return updated;
      });
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
    setMessages([
      { role: 'model', parts: [{ text: "Hello! I'm VoterHelp, your intelligent and non-partisan election assistant. How can I help you understand the election process today?" }] }
    ]);
  };

  const tabs = [
    { 
      label: "Register as Voter", 
      response: `![Register as Voter](/tab-register.png)\n\n### How to Register as a Voter in India\n\n**Step 1: Check Eligibility**\nYou must be an Indian citizen, 18 years or older as of January 1st of the revision year, and an ordinary resident of the polling area.\n\n**Step 2: Obtain the Form**\nFill out **Form 6**.\n\n**Step 3: Gather Documents**\nYou will need a recent passport-sized photograph, a valid Proof of Age (like a birth certificate or 10th marksheet), and a valid Proof of Residence (like an Aadhaar card, electricity bill, or passport).\n\n**Step 4: Submission**\n- **Online:** Visit the NVSP portal (nvsp.in) or use the Voter Helpline App (VHA) to upload your documents and submit.\n- **Offline:** Submit physical copies to your local Electoral Registration Officer (ERO) or Booth Level Officer (BLO).\n\n**Step 5: Verification**\nA BLO will visit your residence to verify your address. Once approved, your name will be added to the electoral roll!`
    },
    { 
      label: "Missing from List (SIR)", 
      response: `![Missing from List](/tab-missing.png)\n\n### How to Re-enroll if Removed by Mistake (SIR)\n\nIf your name was deleted during the Summary Revision (identified as Shifted, Dead, or Missing), follow these steps:\n\n**Step 1: Verification**\nVerify that your name is actually missing by searching the electoral roll online at the NVSP portal.\n\n**Step 2: File Form 6 Again**\nIf deleted by mistake, you must re-apply for fresh inclusion. Fill out **Form 6**.\n\n**Step 3: Immediate Action**\nSubmit the form immediately to your Electoral Registration Officer (ERO) or Booth Level Officer (BLO). It is your statutory right to be on the voter list if you are an eligible resident.\n\n**Step 4: Physical Verification**\nThe BLO will visit your residence to verify that you are indeed living at that address.`
    },
    { 
      label: "Correct Address", 
      response: `![Correct Address](/tab-correct.png)\n\n### How to Correct Your Address on Voter ID\n\nIf your Voter ID has the wrong address or typos, follow these steps:\n\n**Step 1: Obtain Form 8**\nYou must submit an application using **Form 8** for rectification of particulars.\n\n**Step 2: Attach Proof**\nAttach a valid document proving your correct address (e.g., Aadhaar, Bank Passbook, utility bill).\n\n**Step 3: Submission**\nSubmit the form online via NVSP/VHA or offline to your ERO/BLO.\n\n**Step 4: Issuance**\nThe Electoral Registration Officer will issue a new EPIC (Voter ID card) with the exact same EPIC number after making the necessary corrections in their database.`
    },
    { 
      label: "Change Constituency", 
      response: `![Change Constituency](/tab-change.png)\n\n### How to Change Your Constituency\n\nIf you have shifted your residence permanently, follow these steps:\n\n**Step 1: Identify your Shift**\n- **Within the same constituency:** Fill out **Form 8A**.\n- **To a completely new constituency:** You must treat this as a new enrollment and fill out **Form 6**.\n\n**Step 2: Declare Previous Address**\nWhen filling out Form 6 for a new constituency, ensure you declare your previous address. This ensures your name is deleted from the old constituency's list, as being registered in two places is illegal.\n\n**Step 3: Submission**\nSubmit the forms to the ERO of your *new* area of residence to ensure you are enrolled there.`
    },
    { 
      label: "How to use this app", 
      response: `![App Guide](/tab-guide.png)\n\n### Welcome to VoterHelp!\n\nHere is a step-by-step guide on how to use this assistant:\n\n**1. Ask Custom Questions:**\nType any question about the election process in the text box below (e.g., "What is the Model Code of Conduct?"). The AI will read the official Election Commission guidelines to answer you.\n\n**2. Use Voice Input:**\nClick the microphone icon to speak your question instead of typing! You can select your preferred regional language (Hindi, Bengali, Tamil, etc.) from the dropdown next to the mic.\n\n**3. Quick Static Guides:**\nClick any of the scrolling tabs above to instantly view step-by-step guides on common procedures like registering to vote or correcting your address.`
    },
  ];

  const handleStaticTabClick = (tab) => {
    // Instantly append the user's implicit question and the static response
    setMessages(prev => [
      ...prev,
      { role: 'user', parts: [{ text: tab.label }] },
      { role: 'model', parts: [{ text: tab.response }] }
    ]);
    scrollToBottom();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <header className="glass" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 20px 0 20px', borderRadius: '16px 16px 0 0', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="var(--primary)" />
          <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.2rem' }}>VoterHelp</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user.displayName || user.email}</span>
          <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Logout">
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
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none' // IE/Edge
      }} className="hide-scrollbar">
        {tabs.map((tab, index) => (
          <button 
            key={index}
            className="btn-secondary"
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
      <div className="glass-panel" style={{ flex: 1, margin: '0 20px', borderRadius: '0', borderTop: 'none', borderBottom: 'none', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.length === 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }} className="animate-fade-in">
            <img src="/vote-illustration.png" alt="Casting Vote" style={{ height: '200px', objectFit: 'contain', opacity: 0.9 }} />
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', gap: '15px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }} className="animate-fade-in">
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: msg.role === 'user' ? 'var(--primary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {msg.role === 'user' ? <User size={20} color="white" /> : <Info size={20} color="white" />}
            </div>
            <div style={{ 
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
                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked(msg.parts[0].text) }} />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Loader2 className="animate-spin" size={20} color="white" />
            </div>
            <div style={{ padding: '15px', color: 'var(--text-muted)' }}>Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="glass" style={{ padding: '20px', margin: '0 20px 20px 20px', borderRadius: '0 0 16px 16px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={clearChat} 
            title="Clear Chat"
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
          <select 
            value={speechLanguage} 
            onChange={(e) => setSpeechLanguage(e.target.value)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-md)',
              padding: '0 10px',
              height: '46px',
              color: 'var(--text-main)',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
            }}
            title="Select Spoken Language"
          >
            <option value="en-IN" style={{color: 'black'}}>English</option>
            <option value="hi-IN" style={{color: 'black'}}>Hindi (हिन्दी)</option>
            <option value="bn-IN" style={{color: 'black'}}>Bengali (বাংলা)</option>
            <option value="ta-IN" style={{color: 'black'}}>Tamil (தமிழ்)</option>
            <option value="te-IN" style={{color: 'black'}}>Telugu (తెలుగు)</option>
            <option value="mr-IN" style={{color: 'black'}}>Marathi (मराठी)</option>
            <option value="gu-IN" style={{color: 'black'}}>Gujarati (ગુજરાતી)</option>
          </select>
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
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about elections, timelines, or procedures..."
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
