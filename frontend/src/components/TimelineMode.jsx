import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Volume2, Square } from 'lucide-react';
import { getTimelinePhases } from '../data/timelineData';

export default function TimelineMode({ appLanguage }) {
  const [expandedId, setExpandedId] = useState(null);
  const [playingKey, setPlayingKey] = useState(null);
  const synthRef = useRef(null);

  const phases = getTimelinePhases(appLanguage);

  const toggle = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
    stopSpeech();
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setPlayingKey(null);
  };

  const speak = (text, key) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (playingKey === key) { setPlayingKey(null); return; }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = appLanguage;
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = appLanguage.split('-')[0];
    const voice = voices.find(v => v.lang === appLanguage) ||
                  voices.find(v => v.lang.startsWith(langPrefix));
    if (voice) utter.voice = voice;
    utter.onend = () => setPlayingKey(null);
    utter.onerror = () => setPlayingKey(null);
    setPlayingKey(key);
    window.speechSynthesis.speak(utter);
  };

  const getSectionText = (sec) => {
    let t = sec.heading + '. ';
    if (sec.content) t += sec.content + ' ';
    if (sec.items)   t += sec.items.join('. ');
    return t.replace(/[*#]/g, '');
  };

  return (
    <div className="timeline-mode">
      <div className="timeline-header">
        <h2 className="gradient-text">🗳️ {phases[0]?.modeTitle || 'Indian Election Timeline'}</h2>
        <p>{phases[0]?.modeSubtitle || 'Click any phase to explore it in depth.'}</p>
      </div>

      <div className="timeline-track">
        {phases.map((phase, idx) => {
          const isOpen = expandedId === phase.id;
          return (
            <div key={phase.id} className={`timeline-item ${isOpen ? 'expanded' : ''}`}>
              {idx < phases.length - 1 && (
                <div className="timeline-line" style={{ borderColor: phase.color }} />
              )}

              <button
                className="timeline-node"
                onClick={() => toggle(phase.id)}
                style={{ '--phase-color': phase.color }}
                aria-expanded={isOpen}
              >
                <div className="timeline-badge" style={{ background: phase.color }}>
                  <span className="timeline-step">{phase.id}</span>
                </div>
                <div className="timeline-node-body">
                  <span className="timeline-icon">{phase.icon}</span>
                  <div>
                    <div className="timeline-title">{phase.title}</div>
                    <div className="timeline-summary">{phase.subtitle}</div>
                  </div>
                </div>
                <span className="timeline-chevron">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {isOpen && (
                <div className="timeline-content animate-fade-in">
                  <div className="timeline-keyfact">
                    <span className="keyfact-label">⚡</span>
                    <span>{phase.keyFact}</span>
                  </div>

                  {phase.sections.map((sec, si) => {
                    const key = `${phase.id}-${si}`;
                    const isPlaying = playingKey === key;
                    return (
                      <div key={si} className="timeline-section">
                        <div className="timeline-section-header">
                          <h4 className="timeline-section-heading">{sec.heading}</h4>
                          <button
                            className={`listen-btn timeline-listen-btn ${isPlaying ? 'playing' : ''}`}
                            onClick={() => speak(getSectionText(sec), key)}
                            title={isPlaying ? 'Stop' : 'Listen'}
                          >
                            {isPlaying ? <Square size={13} fill="currentColor" /> : <Volume2 size={13} />}
                            {isPlaying ? 'Stop' : 'Listen'}
                          </button>
                        </div>
                        {sec.content && <p className="timeline-section-text">{sec.content}</p>}
                        {sec.items && (
                          <ul className="timeline-section-list">
                            {sec.items.map((item, ii) => <li key={ii}>{item}</li>)}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
