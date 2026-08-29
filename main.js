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

function addressAccessibilityIssues() {
  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex') && element.tabIndex < 0) {
      element.setAttribute('tabindex', '0');
    }
  });

  // Ensure all images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach(image => {
    if (!image.hasAttribute('alt')) {
      image.setAttribute('alt', '');
    }
  });

  // Ensure all form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (id && !document.querySelector(`label[for="${id}"]`)) {
      console.warn(`Input with id "${id}" is missing an associated label.`);
    }
  });

  // Ensure proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      console.warn(`Heading hierarchy skipped from h${previousLevel} to h${currentLevel}.`);
    }
    previousLevel = currentLevel;
  });

  // Ensure sufficient color contrast (basic check - flag potential issues)
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const style = window.getComputedStyle(element);
    const color = style.color;
    const backgroundColor = style.backgroundColor;
    if (color && backgroundColor && color !== backgroundColor) {
      // Placeholder for contrast ratio calculation
      // In production, use a proper contrast checking library
    }
  });

  // Ensure ARIA landmarks are present
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"]');
  if (landmarks.length === 0) {
    console.warn('No ARIA landmarks found. Consider adding navigation, main, banner, and contentinfo roles.');
  }

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