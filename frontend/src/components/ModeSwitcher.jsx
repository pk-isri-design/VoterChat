import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ModeSwitcher = memo(({ appMode, setAppMode }) => {
  const modes = [
    { id: 'chat',     label: '🧠 Ask AI' },
    { id: 'timeline', label: '🗳️ Timeline' },
    { id: 'quiz',     label: '🎯 Quiz' },
  ];

  return (
    <div className="mode-switcher" style={{ margin: '0 20px', background: 'rgba(255,255,255,0.6)', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
      {modes.map(tab => (
        <button
          key={tab.id}
          id={`mode-tab-${tab.id}`}
          className={`mode-tab ${appMode === tab.id ? 'active' : ''}`}
          onClick={() => setAppMode(tab.id)}
          aria-pressed={appMode === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});

ModeSwitcher.propTypes = {
  appMode: PropTypes.string.isRequired,
  setAppMode: PropTypes.func.isRequired
};

export default ModeSwitcher;
