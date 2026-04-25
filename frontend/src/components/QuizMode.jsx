import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw } from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizMode({ appLanguage }) {
  const [question, setQuestion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setQuestion(null);
    setSelectedIndex(null);
    setRevealed(false);
    setError(null);

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiBase}/api/chat`, {
        message: 'Generate a new quiz question about Indian elections.',
        history: [],
        language: appLanguage,
        mode: 'quiz',
      });

      const raw = response.data.text.trim();
      // Strip possible markdown code fences
      const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const parsed = JSON.parse(jsonStr);
      setQuestion(parsed);
    } catch (err) {
      console.error('Quiz fetch error:', err);
      setError('Failed to load a question. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [appLanguage]);

  const handleOptionSelect = (idx) => {
    if (revealed) return;
    setSelectedIndex(idx);
    setRevealed(true);
    const isCorrect = idx === question.correctIndex;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleStart = () => {
    setStarted(true);
    fetchQuestion();
  };

  const handleReset = () => {
    setScore({ correct: 0, total: 0 });
    setStarted(false);
    setQuestion(null);
    setError(null);
  };

  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  // --- Splash screen ---
  if (!started) {
    return (
      <div className="quiz-splash animate-fade-in">
        <div className="quiz-splash-icon">🎯</div>
        <h2 className="gradient-text">Election Quiz</h2>
        <p>Test your knowledge of Indian elections! Answer multiple-choice questions on voter rights, EVMs, Election Commission rules, and more.</p>
        <div className="quiz-rules">
          <div className="quiz-rule-item">📋 One question at a time</div>
          <div className="quiz-rule-item">✅ Instant feedback after each answer</div>
          <div className="quiz-rule-item">📊 Score tracked throughout</div>
        </div>
        <button className="btn-primary quiz-start-btn" onClick={handleStart}>
          Start Quiz 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-mode">
      {/* Score bar */}
      <div className="quiz-score-bar">
        <div className="quiz-score-label">
          <Trophy size={16} color="#f59e0b" />
          <span>Score: <strong>{score.correct}/{score.total}</strong></span>
        </div>
        <div className="quiz-progress-track">
          <div
            className="quiz-progress-fill"
            style={{ width: `${percentage}%`, background: percentage >= 70 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444' }}
          />
        </div>
        <span className="quiz-pct">{percentage}%</span>
        <button className="quiz-reset-btn" onClick={handleReset} title="Reset quiz">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Question card */}
      {loading && (
        <div className="quiz-loading animate-fade-in">
          <Loader2 className="animate-spin" size={32} color="#d97706" />
          <p>Generating question…</p>
        </div>
      )}

      {error && !loading && (
        <div className="quiz-error animate-fade-in">
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchQuestion}>Try Again</button>
        </div>
      )}

      {question && !loading && (
        <div className="quiz-card animate-fade-in">
          <div className="quiz-question-number">Question #{score.total}</div>
          <h3 className="quiz-question">{question.question}</h3>

          <div className="quiz-options">
            {question.options.map((opt, idx) => {
              const isCorrect = idx === question.correctIndex;
              const isSelected = idx === selectedIndex;
              let stateClass = '';
              if (revealed) {
                if (isCorrect) stateClass = 'correct';
                else if (isSelected) stateClass = 'wrong';
                else stateClass = 'dimmed';
              }

              return (
                <button
                  key={idx}
                  className={`quiz-option ${stateClass}`}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={revealed}
                >
                  <span className="quiz-option-label">{OPTION_LABELS[idx]}</span>
                  <span className="quiz-option-text">{opt}</span>
                  {revealed && isCorrect && <CheckCircle size={18} className="quiz-option-icon" />}
                  {revealed && isSelected && !isCorrect && <XCircle size={18} className="quiz-option-icon" />}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className={`quiz-feedback animate-fade-in ${selectedIndex === question.correctIndex ? 'correct' : 'wrong'}`}>
              <div className="quiz-feedback-header">
                {selectedIndex === question.correctIndex
                  ? <><CheckCircle size={20} /> Correct! Well done!</>
                  : <><XCircle size={20} /> Incorrect — the right answer was <strong>{OPTION_LABELS[question.correctIndex]}</strong></>
                }
              </div>
              <p className="quiz-explanation">{question.explanation}</p>
            </div>
          )}

          {revealed && (
            <button className="btn-primary quiz-next-btn animate-fade-in" onClick={fetchQuestion}>
              Next Question <ChevronRight size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
