// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: ensureDependencyGraphARIA, getLangAttribute)

// Helper function to get the language attribute value
function getLangAttribute() {
  // Try to get the language from various sources
  // Check for explicit HTML lang attribute first
  if (document.documentElement && document.documentElement.lang) {
    return document.documentElement.lang;
  }
  
  // Fall back to browser language or default to 'en'
  return navigator.language || navigator.userLanguage || 'en';
}

// Ensure ARIA attributes are properly set
function ensureDependencyGraphARIA() {
  // Set the lang attribute on the HTML element for accessibility
  const lang = getLangAttribute();
  document.documentElement.setAttribute('lang', lang);
}

// Existing code starts here
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Call the ARIA ensure function before rendering
if (typeof document !== 'undefined') {
  ensureDependencyGraphARIA();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export { getLangAttribute, ensureDependencyGraphARIA };