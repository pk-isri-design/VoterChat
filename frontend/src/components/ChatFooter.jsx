import React from 'react';
import { Send, Trash2, Mic, MicOff } from 'lucide-react';
import { translations } from '../utils/translations';

export default function ChatFooter({
  appLanguage,
  input,
  setInput,
  handleSend,
  loading,
  clearChat,
  isListening,
  toggleListening
}) {
  return (
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
          placeholder={translations[appLanguage]?.askPlaceholder || 'Type your message...'}
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
  );
}
