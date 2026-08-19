import { getQuestion, submitAnswer } from './API';
import { useState, useEffect } from 'react';

// Conflict markers preserved
<<<<<<< HEAD
const toggleDarkMode = () => {
=======
const toggleDarkMode = () => document.body.classList.toggle('dark-mode');
>>>>>>> dark-mode-toggle
};
const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const mode = localStorage.getItem('darkmode');
    setIsDarkMode(mode === 'enabled');
  }, []);
  const toggle = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkmode', isDarkMode ? 'disabled' : 'enabled');
  };
  return (
    <div>
      <button aria-label="Toggle dark mode" onClick={toggle}>
        {isDarkMode ? 'Disable' : 'Enable'} Dark Mode
      </button>
      {children}
    </div>
  );
};
const QuickQuestion = ({ questionId }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const question = useQuestion(questionId);
  const handleSubmit = async () => {
    await submitAnswer(questionId, showAnswer ? 'Yes' : 'No');
  };
  return (
    <div className="quick-question">
      <h3>{question.text}</h3>
      <button onClick={() => setShowAnswer(!showAnswer)}>
        Toggle Answer {showAnswer ? '▼' : '►'}
      </button>
      {showAnswer && <p aria-expanded={showAnswer}>{question.answer}</p>}
    </div>
  );
};
export { HomePage, DarkModeProvider, QuickQuestion };