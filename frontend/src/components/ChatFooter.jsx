import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Send, Trash2, Mic, MicOff } from 'lucide-react';
import { translations } from '../utils/translations';

/**
 * Renders the bottom action bar for the chat interface, containing the text input field,
 * send button, microphone toggle, and clear chat button.
 *
 * @param {Object} props - The component props.
 * @param {string} props.appLanguage - Current application language code.
 * @param {string} props.input - Current value of the chat input field.
 * @param {Function} props.setInput - State setter function for the chat input field.
 * @param {Function} props.handleSend - Callback executed to submit the message to the AI.
 * @param {boolean} props.loading - Indicates if the AI is currently generating a response.
 * @param {Function} props.clearChat - Callback to reset the chat history.
 * @param {boolean} props.isListening - Indicates if the microphone is currently actively recording.
 * @param {Function} props.toggleListening - Callback to start or stop microphone recording.
 * @returns {JSX.Element} The chat footer component.
 */
const ChatFooter = memo(({
  appLanguage,
  input,
  setInput,
  handleSend,
  loading,
  clearChat,
  isListening,
  toggleListening
}) => {
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
          className={`btn-secondary ${isListening ? 'mic-active' : ''}`}
          onClick={toggleListening}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 15px', height: '46px', flexShrink: 0 }}
          title={isListening ? "Stop listening" : "Start speaking"}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <input
          className="chat-input footer-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={translations[appLanguage]?.askPlaceholder || 'Type your message...'}
          aria-label="Chat input"
          style={{ flex: 1, padding: '0 15px', height: '46px', fontSize: '1rem' }}
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
});

ChatFooter.propTypes = {
  appLanguage: PropTypes.string.isRequired,
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  clearChat: PropTypes.func.isRequired,
  isListening: PropTypes.bool.isRequired,
  toggleListening: PropTypes.func.isRequired
};

export default ChatFooter;
