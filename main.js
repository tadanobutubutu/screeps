import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Main entry point for the React application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Accessibility enhancement: Set lang attribute on document
document.documentElement.lang = 'en';

// Helper function to generate unique IDs for accessibility attributes
export const generateId = (prefix = 'a11y') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Accessibility helper: Announce messages to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

// Skip link functionality for keyboard navigation
export const initSkipLinks = () => {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
};

// Initialize accessibility features on mount
if (typeof window !== 'undefined') {
  window.addEventListener('load', initSkipLinks);
}