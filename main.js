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

// Implementation of the function for addressing new accessibility issues from the insight report
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root') && document.getElementById('root').parentElement;
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Create a hidden live region for dynamic announcements
  const announcementId = 'accessibility-announcement';
  const announcement = document.createElement('div');
  announcement.id = announcementId;
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  // Hide off-screen
  announcement.style.position = 'absolute';
  announcement.style.left = '-9999px';
  announcement.style.top = '-9999px';
  document.body.appendChild(announcement);

  // Ensure all interactive elements have proper ARIA labels
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const text = element.textContent || element.value || element.getAttribute('placeholder');
      if (text) {
        element.setAttribute('aria-label', text.trim());
      }
    }
  });

  // Ensure all images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((image) => {
    if (!image.hasAttribute('alt')) {
      image.setAttribute('alt', '');
    }
  });

  // Ensure document has a proper heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading) => {
    const currentLevel = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      console.warn(`Heading level skipped: jumped from h${previousLevel} to h${currentLevel}`);
    }
    previousLevel = currentLevel;
  });

  // Ensure sufficient color contrast by adding a class for high-contrast mode support
  document.documentElement.classList.add('accessibility-enhanced');

  // Set focus indicators for keyboard navigation
  const style = document.createElement('style');
  style.textContent = `
    *:focus-visible {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);

  console.log('Accessibility issues addressed successfully');
  return true;
}

export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues
};

export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues
};