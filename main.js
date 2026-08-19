import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add lang attribute to the root element for better screen reader support
document.documentElement.lang = 'en';

// Add ARIA landmark roles if they're missing in the App component
// This would typically be handled in the App component itself, but we'll add it here as a fallback
if (!document.querySelector('[role="main"]')) {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.setAttribute('role', 'main');
  }
}

// Add focus management for keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    background: #000;
    color: #fff;
    padding: 0.5rem;
    z-index: 100;
  `;
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);

  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.id = 'main-content';
  }
});