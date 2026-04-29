import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { User, Info, Loader2, Volume2, Square } from 'lucide-react';
import { marked } from 'marked';
import { translations } from '../utils/translations';

const MessageList = memo(({
  messages,
  loading,
  appLanguage,
  playingIndex,
  playMessage,
  messagesEndRef
}) => {
  return (
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
          <div className={`chat-bubble ${msg.role}`} style={{
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
                  className="listen-btn"
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
          <div style={{ padding: '15px', color: 'var(--text-muted)' }}>{translations[appLanguage]?.thinking || 'Thinking...'}</div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
});

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      parts: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  appLanguage: PropTypes.string.isRequired,
  playingIndex: PropTypes.number,
  playMessage: PropTypes.func.isRequired,
  messagesEndRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default MessageList;
