import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = 'en';

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

function applyAccessibilityFixes() {
  const elements = document.querySelectorAll('[data-accessibility-issue]');
  elements.forEach(element => {
    const issue = element.getAttribute('data-accessibility-issue');
    switch (issue) {
      case 'missing-alt':
        if (!element.getAttribute('alt')) {
          element.setAttribute('alt', '');
        }
        break;
      case 'missing-label':
        const id = element.getAttribute('id');
        if (id && !document.querySelector(`label[for="${id}"]`)) {
          element.setAttribute('aria-label', element.getAttribute('placeholder') || 'Input field');
        }
        break;
      case 'low-contrast':
        element.style.color = '#000000';
        element.style.backgroundColor = '#ffffff';
        break;
      case 'missing-role':
        if (!element.getAttribute('role')) {
          element.setAttribute('role', 'button');
        }
        break;
      default:
        break;
    }
  });
}

applyAccessibilityFixes();

export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  applyAccessibilityFixes
};

export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  applyAccessibilityFixes
};