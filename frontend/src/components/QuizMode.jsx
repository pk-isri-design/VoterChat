import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight } from 'lucide-react';
import { getQuizQuestions } from '../data/quizData';

const QUESTIONS_PER_QUIZ = 5;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Splash ── */
function Splash({ onStart, lang }) {
  const labels = {
    'en-IN': { title: 'Election Quiz', desc: 'Read each situation carefully. You\'ll get 5 random questions.', btn: 'Start Quiz 🚀' },
    'hi-IN': { title: 'चुनाव प्रश्नोत्तरी', desc: 'प्रत्येक स्थिति को ध्यान से पढ़ें। आपको 5 यादृच्छिक प्रश्न मिलेंगे।', btn: 'प्रश्नोत्तरी शुरू करें 🚀' },
    'bn-IN': { title: 'নির্বাচন কুইজ', desc: 'প্রতিটি পরিস্থিতি মনোযোগ সহকারে পড়ুন। আপনি ৫টি র্যান্ডম প্রশ্ন পাবেন।', btn: 'কুইজ শুরু করুন 🚀' },
    'ta-IN': { title: 'தேர்தல் வினாடி வினா', desc: 'ஒவ்வொரு சூழ்நிலையையும் கவனமாகப் படியுங்கள். உங்களுக்கு 5 சீரற்ற கேள்விகள் கிடைக்கும்.', btn: 'வினாடி வினாவைத் தொடங்கு 🚀' },
    'te-IN': { title: 'ఎన్నికల క్విజ్', desc: 'ప్రతి పరిస్థితిని జాగ్రత్తగా చదవండి. మీరు 5 యాదృచ్ఛిక ప్రశ్నలను పొందుతారు.', btn: 'క్విజ్ ప్రారంభించండి 🚀' },
    'mr-IN': { title: 'निवडणूक क्विझ', desc: 'प्रत्येक परिस्थिती काळजीपूर्वक वाचा. तुम्हाला ५ यादृच्छिक प्रश्न मिळतील.', btn: 'क्विझ सुरू करा 🚀' },
    'gu-IN': { title: 'ચૂંટણી ક્વિઝ', desc: 'દરેક પરિસ્થિતિને ધ્યાનથી વાંચો. તમને 5 યાદૃચ્છિક પ્રશ્નો મળશે.', btn: 'ક્વિઝ શરૂ કરો 🚀' }
  };
  const l = labels[lang] || labels['en-IN'];
  return (
    <div className="quiz-splash animate-fade-in">
      <div className="quiz-splash-icon">🎯</div>
      <h2 className="gradient-text">{l.title}</h2>
      <p>{l.desc}</p>
      <button className="btn-primary quiz-start-btn" onClick={onStart}>
        {l.btn}
      </button>
    </div>
  );
}

/* ── Results ── */
function Results({ score, total, answers, questions, onRestart, lang }) {
  const labels = {
    'en-IN': { title: 'Quiz Complete!', playAgain: 'Play Again' },
    'hi-IN': { title: 'प्रश्नोत्तरी पूर्ण!', playAgain: 'फिर से खेलें' },
    'bn-IN': { title: 'কুইজ সম্পন্ন!', playAgain: 'আবার খেলুন' },
    'ta-IN': { title: 'வினாடி வினா முடிந்தது!', playAgain: 'மீண்டும் விளையாடு' },
    'te-IN': { title: 'క్విజ్ పూర్తయింది!', playAgain: 'మళ్ళీ ఆడండి' },
    'mr-IN': { title: 'क्विझ पूर्ण झाले!', playAgain: 'पुन्हा खेळा' },
    'gu-IN': { title: 'ક્વિઝ પૂર્ણ!', playAgain: 'ફરીથી રમો' }
  };
  const l = labels[lang] || labels['en-IN'];
  const pct = Math.round((score / total) * 100);
  return (
    <div className="quiz-results animate-fade-in">
      <div className="results-trophy">🏆</div>
      <h2 className="gradient-text results-title">{l.title}</h2>
      <div className="results-score-ring">
        <span className="results-score-num">{score}<span className="results-score-total">/{total}</span></span>
        <span className="results-score-pct">{pct}%</span>
      </div>
      <button className="btn-primary quiz-start-btn" onClick={onRestart}>
        <RotateCcw size={16} /> {l.playAgain}
      </button>
    </div>
  );
}

/* ── Main Quiz ── */
export default function QuizMode({ appLanguage }) {
  const [phase, setPhase] = useState('splash');
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const startQuiz = () => {
    const picked = shuffle(getQuizQuestions(appLanguage)).slice(0, QUESTIONS_PER_QUIZ);
    setQuestions(picked);
    setCurrentIdx(0);
    setSelected(null);
    setAnswers([]);
    setPhase('quiz');
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    if (currentIdx < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIdx(i => i + 1);
      setSelected(null);
    } else {
      // Submit
      setAnswers(newAnswers);
      setPhase('results');
    }
  };

  if (phase === 'splash') return <Splash onStart={startQuiz} lang={appLanguage} />;

  if (phase === 'results') {
    const score = answers.filter((a, i) => a === questions[i].correct).length;
    return (
      <Results
        score={score}
        total={questions.length}
        answers={answers}
        questions={questions}
        onRestart={() => setPhase('splash')}
        lang={appLanguage}
      />
    );
  }

  /* ── Quiz phase ── */
  const q = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const progress = ((currentIdx) / questions.length) * 100;

  const labels = {
    'en-IN': { q: 'Question', of: 'of', situation: 'Situation' },
    'hi-IN': { q: 'प्रश्न', of: 'का', situation: 'स्थिति' },
    'bn-IN': { q: 'প্রশ্ন', of: 'এর', situation: 'পরিস্থিতি' },
    'ta-IN': { q: 'கேள்வி', of: 'இல்', situation: 'சூழ்நிலை' },
    'te-IN': { q: 'ప్రశ్న', of: 'లో', situation: 'పరిస్థితి' },
    'mr-IN': { q: 'प्रश्न', of: 'पैकी', situation: 'परिस्थिती' },
    'gu-IN': { q: 'પ્રશ્ન', of: 'ના', situation: 'પરિસ્થિતિ' }
  };
  const l = labels[appLanguage] || labels['en-IN'];

  return (
    <div className="quiz-mode animate-fade-in">
      {/* Progress bar */}
      <div className="quiz-progress-header">
        <span className="quiz-progress-label">{l.q} {currentIdx + 1} {l.of} {questions.length}</span>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className="quiz-card">
        {/* Situation */}
        <div className="quiz-situation">
          <span className="quiz-situation-badge">📌 {l.situation}</span>
          <p>{q.situation}</p>
        </div>

        {/* Question */}
        <h3 className="quiz-question">{q.question}</h3>

        {/* Radio options */}
        <div className="quiz-options" role="radiogroup" aria-label="Answer options">
          {q.options.map((opt, idx) => (
            <label
              key={idx}
              className={`quiz-option-label-wrap ${selected === idx ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={`q${q.id}`}
                value={idx}
                checked={selected === idx}
                onChange={() => setSelected(idx)}
                className="quiz-radio"
              />
              <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="quiz-option-text">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="quiz-nav">
        <button
          className="btn-primary quiz-nav-btn"
          onClick={handleNext}
          disabled={selected === null}
        >
          {isLast ? (
            <>Submit <Trophy size={16} /></>
          ) : (
            <>Next <ChevronRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
}
