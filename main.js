// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Accessibility: Set lang attribute on document element
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);