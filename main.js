// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// REACT_015: Add lang attribute for accessibility
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);