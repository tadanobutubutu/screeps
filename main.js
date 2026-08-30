import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

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
 */
function setLanguageAttribute() {
  document.documentElement.lang = 'en';
}

/**
 * Adds landmark roles to elements for accessibility.
 */
function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
  const main = document.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

/**
 * Fixes fake links (elements that look like links but are not <a> tags).
 */
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[data-fake-link]');
  fakeLinks.forEach(el => {
    el.setAttribute('role', 'link');
    el.setAttribute('tabindex', '0');
  });
}

/**
 * Checks if the current environment is a secure context.
 * @returns {boolean} Returns true if running in a secure context.
 */
function isSecureContext() {
  if (typeof window !== 'undefined' && window.isSecureContext !== undefined) {
    return window.isSecureContext;
  }
  return false;
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
export {
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  initApp,
  landmarks,
  appData,
  icons
};