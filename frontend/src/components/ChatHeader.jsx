import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Sparkles, LogOut, Sun, Moon, Minus, Plus, Type, Globe } from 'lucide-react';
import { logout } from '../firebase';

const ChatHeader = memo(({ 
  user, 
  appLanguage, 
  setAppLanguage, 
  highContrast, 
  setHighContrast, 
  handleDecreaseText, 
  handleIncreaseText 
}) => {
  return (
    <header className="glass chat-header" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 20px 0 20px', borderRadius: '16px 16px 0 0', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Sparkles color="var(--primary)" />
        <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.2rem' }}>VoterHelp</h2>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Language Selector */}
        <div className="tab-btn mode-lang-tab" style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: 'var(--primary)', color: 'white',
          borderRadius: 'var(--radius-sm)', padding: '4px 8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flexShrink: 0
        }}>
          <Globe size={14} />
          <select
            value={appLanguage}
            onChange={(e) => setAppLanguage(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
            title="Change App Language" aria-label="Change App Language"
          >
            <option value="en-IN" style={{ background: '#fff', color: '#1e293b' }}>EN</option>
            <option value="hi-IN" style={{ background: '#fff', color: '#1e293b' }}>HI</option>
            <option value="bn-IN" style={{ background: '#fff', color: '#1e293b' }}>BN</option>
            <option value="ta-IN" style={{ background: '#fff', color: '#1e293b' }}>TA</option>
            <option value="te-IN" style={{ background: '#fff', color: '#1e293b' }}>TE</option>
            <option value="mr-IN" style={{ background: '#fff', color: '#1e293b' }}>MR</option>
            <option value="gu-IN" style={{ background: '#fff', color: '#1e293b' }}>GU</option>
          </select>
        </div>

        {/* Accessibility Controls */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
          <button onClick={() => setHighContrast(!highContrast)} style={{ background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }} title="Toggle High Contrast" aria-label="Toggle High Contrast">
            {highContrast ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button onClick={handleDecreaseText} style={{ background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }} title="Decrease text size" aria-label="Decrease text size"><Minus size={14} /></button>
          <button onClick={handleIncreaseText} style={{ background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }} title="Increase text size" aria-label="Increase text size"><Plus size={14} /></button>
        </div>
        
        <span className="header-username" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '4px' }}>{user.displayName || user.email}</span>
        
        <button onClick={() => {
          logout();
          if (user.isGuest) window.location.reload();
        }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '4px' }} title="Logout" aria-label="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
});

ChatHeader.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    isGuest: PropTypes.bool
  }).isRequired,
  appLanguage: PropTypes.string.isRequired,
  setAppLanguage: PropTypes.func.isRequired,
  highContrast: PropTypes.bool.isRequired,
  setHighContrast: PropTypes.func.isRequired,
  handleDecreaseText: PropTypes.func.isRequired,
  handleIncreaseText: PropTypes.func.isRequired
};

export default ChatHeader;
