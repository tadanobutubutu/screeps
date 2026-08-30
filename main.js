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
 * Sets the lang attribute on the HTML element.
 * @param {string} lang - The language code to set. Defaults to 'en'.
 */
function setLanguageAttribute(lang = 'en') {
  if (document.documentElement) {
    document.documentElement.setAttribute('lang', lang);
  }
}

/**
 * Adds landmark roles to elements based on their IDs.
 */
function addLandmarkRoles() {
  const landmarkMap = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'footer': 'contentinfo',
    'aside': 'complementary'
  };

  Object.keys(landmarkMap).forEach(id => {
    const element = document.getElementById(id);
    if (element && !element.hasAttribute('role')) {
      element.setAttribute('role', landmarkMap[id]);
    }
  });
}

/**
 * Validates table accessibility.
 */
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.tHead && !table.querySelector('thead')) {
      console.warn('Table missing thead element');
    }
    if (!table.tBodies.length && !table.querySelector('tbody')) {
      console.warn('Table missing tbody element');
    }
  });
}

/**
 * Validates table structure.
 */
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

/**
 * Validates landmarks.
 */
function validateLandmark() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary'];
  const elements = document.querySelectorAll('[role]');
  elements.forEach(el => {
    if (landmarkRoles.includes(el.getAttribute('role'))) {
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        console.warn('Landmark missing accessible name');
      }
    }
  });
}

/**
 * Validates landmark structure.
 */
function validateLandmarkStructure() {
  validateLandmark();
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const ref = document.getElementById(ariaLabelledBy);
    if (ref) return ref.textContent;
  }
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  return '';
}

/**
 * Sets SVG attributes for accessibility.
 */
function setSvgAttributes() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      if (name) {
        svg.setAttribute('aria-label', name);
      } else {
        svg.setAttribute('role', 'img');
      }
    }
  });
}

/**
 * Creates an in-page button from a fake link.
 * @param {HTMLElement} element - The fake link element.
 */
function createInPageButton(element) {
  const button = document.createElement('button');
  button.textContent = element.textContent;
  button.setAttribute('type', 'button');
  if (element.id) button.id = element.id;
  if (element.className) button.className = element.className;
  element.parentNode.replaceChild(button, element);
}

/**
 * Validates link accessibility.
 */
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.textContent.trim() && !link.querySelector('img[alt]')) {
      console.warn('Link missing accessible name');
    }
  });
}

/**
 * Handles fake links by converting them to buttons.
 */
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
  fakeLinks.forEach(link => createInPageButton(link));
}

/**
 * Fixes fake links in the document.
 */
function fixFakeLinks() {
  handleFakeLinks();
  validateLinkAccessibility();
}

/**
 * Adds proper landmark regions to the document.
 */
function addProperLandmarkRegions() {
  const hasMain = document.querySelector('main, [role="main"]');
  if (!hasMain) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    const body = document.body;
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  }
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

  // Validate table structure and accessibility
  validateTableAccessibility();
  validateTableStructure();

  // Validate landmarks
  validateLandmark();
  validateLandmarkStructure();

  // Add accessible names to SVGs
  setSvgAttributes();

  // Add proper landmark regions
  addProperLandmarkRegions();

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
export { checkLandmarkElement, ensureUniqueLandmarks, landmarkStructureCheck, setLanguageAttribute, addLandmarkRoles, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, setSvgAttributes, createInPageButton, validateLinkAccessibility, handleFakeLinks, fixFakeLinks, addProperLandmarkRegions, initApp };