import React, { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import { ChevronDown, ChevronUp, Loader2, BookOpen, Smile, FlaskConical } from 'lucide-react';

const PHASES = [
  {
    id: 1,
    icon: '📢',
    title: 'Announcement of Elections',
    summary: 'The Election Commission of India announces the election schedule.',
    color: '#f59e0b',
  },
  {
    id: 2,
    icon: '📝',
    title: 'Filing Nominations',
    summary: 'Candidates submit nomination papers to the Returning Officer.',
    color: '#3b82f6',
  },
  {
    id: 3,
    icon: '🔍',
    title: 'Scrutiny of Nominations',
    summary: 'Returning Officer verifies all nomination papers for eligibility.',
    color: '#8b5cf6',
  },
  {
    id: 4,
    icon: '📣',
    title: 'Campaign Period',
    summary: 'Candidates campaign for votes; Model Code of Conduct is in force.',
    color: '#ec4899',
  },
  {
    id: 5,
    icon: '🗳️',
    title: 'Polling Day',
    summary: 'Voters cast their votes at polling stations across constituencies.',
    color: '#10b981',
  },
  {
    id: 6,
    icon: '🔢',
    title: 'Vote Counting',
    summary: 'Votes are counted under strict supervision after polling ends.',
    color: '#f97316',
  },
  {
    id: 7,
    icon: '🏆',
    title: 'Result Declaration',
    summary: 'Winners are declared and the new government is formed.',
    color: '#06b6d4',
  },
];

export default function TimelineMode({ appLanguage }) {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [phaseContent, setPhaseContent] = useState({});
  const [loadingPhase, setLoadingPhase] = useState(null);

  const fetchPhaseContent = async (phase, variant = 'normal') => {
    const key = `${phase.id}-${variant}`;
    if (phaseContent[key]) return; // cached

    setLoadingPhase(key);
    const variantText = {
      normal: `Explain the "${phase.title}" phase of Indian elections in detail.`,
      simple: `Explain the "${phase.title}" phase of Indian elections like I am 10 years old. Use very simple words.`,
      example: `Give a real-world example of what happens during the "${phase.title}" phase in an Indian general election. Use a specific historical example if possible.`,
    };

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiBase}/api/chat`, {
        message: variantText[variant],
        history: [],
        language: appLanguage,
        mode: 'timeline',
      });
      setPhaseContent(prev => ({ ...prev, [key]: response.data.text }));
    } catch {
      setPhaseContent(prev => ({ ...prev, [key]: '_Failed to load. Please try again._' }));
    } finally {
      setLoadingPhase(null);
    }
  };

  const handlePhaseClick = (phase) => {
    if (expandedPhase?.id === phase.id) {
      setExpandedPhase(null);
    } else {
      setExpandedPhase(phase);
      fetchPhaseContent(phase, 'normal');
    }
  };

  const handleVariant = (e, phase, variant) => {
    e.stopPropagation();
    fetchPhaseContent(phase, variant);
  };

  const activeKey = expandedPhase ? `${expandedPhase.id}-normal` : null;
  const [activeVariant, setActiveVariantState] = useState('normal');

  const switchVariant = (e, phase, variant) => {
    e.stopPropagation();
    setActiveVariantState(variant);
    handleVariant(e, phase, variant);
  };

  return (
    <div className="timeline-mode">
      <div className="timeline-header">
        <h2 className="gradient-text">🗳️ Indian Election Timeline</h2>
        <p>Click any phase to explore it in depth. Use the buttons to simplify or see real examples.</p>
      </div>

      <div className="timeline-track">
        {PHASES.map((phase, idx) => {
          const isExpanded = expandedPhase?.id === phase.id;
          const currentVariant = isExpanded ? activeVariant : 'normal';
          const contentKey = `${phase.id}-${currentVariant}`;
          const content = phaseContent[contentKey];
          const isLoading = loadingPhase === contentKey;

          return (
            <div key={phase.id} className={`timeline-item ${isExpanded ? 'expanded' : ''}`}>
              {/* Connector line */}
              {idx < PHASES.length - 1 && <div className="timeline-line" style={{ borderColor: phase.color }} />}

              {/* Phase node */}
              <button
                className="timeline-node"
                onClick={() => { setActiveVariantState('normal'); handlePhaseClick(phase); }}
                style={{ '--phase-color': phase.color }}
                aria-expanded={isExpanded}
              >
                <div className="timeline-badge" style={{ background: phase.color }}>
                  <span className="timeline-step">{phase.id}</span>
                </div>
                <div className="timeline-node-body">
                  <span className="timeline-icon">{phase.icon}</span>
                  <div>
                    <div className="timeline-title">{phase.title}</div>
                    <div className="timeline-summary">{phase.summary}</div>
                  </div>
                </div>
                <span className="timeline-chevron">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="timeline-content animate-fade-in">
                  {/* Variant switcher */}
                  <div className="variant-tabs">
                    <button
                      className={`variant-tab ${currentVariant === 'normal' ? 'active' : ''}`}
                      onClick={(e) => switchVariant(e, phase, 'normal')}
                    >
                      <BookOpen size={14} /> Explain
                    </button>
                    <button
                      className={`variant-tab ${currentVariant === 'simple' ? 'active' : ''}`}
                      onClick={(e) => switchVariant(e, phase, 'simple')}
                    >
                      <Smile size={14} /> Like I'm 10
                    </button>
                    <button
                      className={`variant-tab ${currentVariant === 'example' ? 'active' : ''}`}
                      onClick={(e) => switchVariant(e, phase, 'example')}
                    >
                      <FlaskConical size={14} /> Real Example
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="timeline-loading">
                      <Loader2 className="animate-spin" size={22} color={phase.color} />
                      <span>Loading…</span>
                    </div>
                  ) : content ? (
                    <div
                      className="markdown-body timeline-markdown"
                      dangerouslySetInnerHTML={{ __html: marked(content) }}
                    />
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
