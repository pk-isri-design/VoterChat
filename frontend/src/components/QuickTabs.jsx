import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { translations } from '../utils/translations';

/**
 * Renders a horizontal, scrollable list of quick-action buttons for common election queries.
 *
 * @param {Object} props - The component props.
 * @param {string} props.appLanguage - The current language code (e.g., 'en-IN').
 * @param {Function} props.handleStaticTabClick - Callback executed when a tab is clicked, receives the tab object.
 * @returns {JSX.Element} The quick tabs container.
 */
const QuickTabs = memo(({ appLanguage, handleStaticTabClick }) => {
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
    }} className="hide-scrollbar chat-tabs" role="region" aria-label="Quick action queries">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className="btn-secondary tab-btn"
          onClick={() => handleStaticTabClick(tab)}
          aria-label={`Ask: ${tab.label}`}
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
});

QuickTabs.propTypes = {
  appLanguage: PropTypes.string.isRequired,
  handleStaticTabClick: PropTypes.func.isRequired
};

export default QuickTabs;
