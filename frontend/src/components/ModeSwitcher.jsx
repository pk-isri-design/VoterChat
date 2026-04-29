import React from 'react';

export default function ModeSwitcher({ appMode, setAppMode }) {
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
}
