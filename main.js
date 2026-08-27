// main.js - Application entry point

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

import { initializeApp } from './app.js';
import { setupAccessibility } from './a11y.js';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  // Ensure lang attribute is set for accessibility (WCAG 3.1.1)
  if (!document.documentElement.lang) {
    document.documentElement.lang = document.documentElement.lang || 'en';
  }
  
  initializeApp(rootElement);
  setupAccessibility();
  
  console.log('Application initialized successfully');
});

export { initializeApp, setupAccessibility };