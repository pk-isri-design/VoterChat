import React from 'react';
import { translations } from '../utils/translations';

export default function QuickTabs({ appLanguage, handleStaticTabClick }) {
  const tabs = translations[appLanguage]?.tabs || [];

  return (
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
  );
}
