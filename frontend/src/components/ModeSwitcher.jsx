import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Global navigation component that switches between the core feature modes of the application.
 *
 * @param {Object} props - The component props.
 * @param {string} props.appMode - The currently active mode ('chat', 'timeline', 'quiz').
 * @param {Function} props.setAppMode - State setter function to change the active mode.
 * @returns {JSX.Element} The mode switcher tab bar.
 */
const ModeSwitcher = memo(({ appMode, setAppMode }) => {
  const modes = [
    { id: 'chat',     label: '🧠 Ask AI' },
    { id: 'timeline', label: '🗳️ Timeline' },
    { id: 'quiz',     label: '🎯 Quiz' },
  ];

  return (
    <div 
      className="mode-switcher" 
      role="tablist"
      aria-label="Application mode selection"
      style={{ margin: '0 20px', background: 'rgba(255,255,255,0.6)', borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center' }}
    >
      {modes.map(tab => (
        <button
          key={tab.id}
          id={`mode-tab-${tab.id}`}
          role="tab"
          className={`mode-tab ${appMode === tab.id ? 'active' : ''}`}
          onClick={() => setAppMode(tab.id)}
          aria-selected={appMode === tab.id}
          aria-label={`Switch to ${tab.id} mode`}
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
