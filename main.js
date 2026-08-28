// Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Ensure lang attribute is set on HTML element for accessibility
document.documentElement.lang = 'en';

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);