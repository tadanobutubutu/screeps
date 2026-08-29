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

// Uncomment the implementation of the function for addressing new accessibility issues from the insight report
function addressAccessibilityIssues() {
  // TODO: Implement the function for addressing new accessibility issues
  const issues = [];
  const elements = document.querySelectorAll('img');
  elements.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: img,
        message: 'Image is missing alt attribute'
      });
    }
  });

  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((el) => {
    const hasLabel =
      el.hasAttribute('aria-label') ||
      el.hasAttribute('aria-labelledby') ||
      el.textContent.trim().length > 0 ||
      el.querySelector('[aria-label]') !== null;
    if (!hasLabel) {
      issues.push({
        type: 'missing-accessible-name',
        element: el,
        message: 'Interactive element is missing an accessible name'
      });
    }
  });

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && level - previousLevel > 1) {
      issues.push({
        type: 'heading-skip',
        element: heading,
        message: `Heading level skipped from h${previousLevel} to h${level}`
      });
    }
    previousLevel = level;
  });

  if (document.documentElement.lang !== 'en' && !document.documentElement.hasAttribute('lang')) {
    issues.push({
      type: 'missing-lang',
      element: document.documentElement,
      message: 'HTML root element is missing lang attribute'
    });
  }

  return {
    total: issues.length,
    issues,
    summary: {
      missingAlt: issues.filter((i) => i.type === 'missing-alt').length,
      missingAccessibleName: issues.filter((i) => i.type === 'missing-accessible-name').length,
      headingSkips: issues.filter((i) => i.type === 'heading-skip').length,
      missingLang: issues.filter((i) => i.type === 'missing-lang').length
    }
  };
}

export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues // Add the new function to the exports
};

export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues // Add the new function to the default export
};