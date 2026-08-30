import './styles.css';

import { initializeApp } from './app.js';
import { registerSW } from 'effector-swift';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = landmark.name + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Testing the checkLandmarkElement function:
// To test this function, we could create a test file with the following content:
const landmarkStructureCheck = (landmark) => {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

/**
 * Sets the language attribute on the HTML element.
 * @param {string} lang - The language code to set (default: 'en').
 */
function setLanguageAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Adds landmark roles to main content areas for accessibility.
 * Ensures a single <main> landmark exists.
 */
function addLandmarkRoles() {
  // Ensure a single <main> landmark exists
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.insertBefore(main, document.body.firstChild);
  }
}

/**
 * Fixes fake links by ensuring they have proper accessibility attributes.
 * Converts divs/spans that behave as links to have proper keyboard navigation
 * and screen reader support.
 */
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[data-fake-link]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'link');
    link.setAttribute('tabindex', '0');
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });
}

/**
 * Initializes the application and applies accessibility fixes.
 */
const initApp = () => {
  // Initialize the main application
  initializeApp();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  ensureUniqueLandmarks(landmarks);

  // Add accessible names to SVGs (example selectors and names)
  icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screps icon"></svg>'
  };

  // Fix fake links
  fixFakeLinks();

  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
  // ... (assuming other initialization logic is present)
};

// Check if the environment is secure before initializing
if (isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

// Register the service worker
registerSW();

// Export functions for testing
// ... (only include exported functions if needed and remove unrelated code)