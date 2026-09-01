import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));

function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.addEventListener('click', onClickHandler);
  return button;
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// REACT_015: Add lang attribute to document
function ensureLangAttribute() {
  if (document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
}

function validateTableAccessibility(table) {
  // Implementation to validate accessibility of tables
  return true;
}

function validateTableStructure(table) {
  // Implementation to validate structure of tables
  return true;
}

// REACT_027: Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      table.insertBefore(caption, table.firstChild);
    }

    const headers = table.querySelectorAll('th');
    const cells = table.querySelectorAll('td, th');

    cells.forEach(cell => {
      if (!cell.hasAttribute('scope') && !cell.hasAttribute('headers')) {
        const isHeader = cell.tagName === 'TH';
        if (isHeader) {
          cell.setAttribute('scope', 'col');
        }
      }
    });
  });
}

function addMainLandmark() {
  // Implementation to add main landmark
}

// REACT_017 & REACT_025: Fix and ensure unique landmarks
function fixLandmarks() {
  const landmarkSelectors = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const landmarkCounts = {};

  landmarkSelectors.forEach(selector => {
    landmarkCounts[selector] = 0;
  });

  document.querySelectorAll(landmarkSelectors.join(', ')).forEach(element => {
    const tagName = element.tagName.toLowerCase();

    if (landmarkCounts[tagName] > 0 && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      landmarkCounts[tagName]++;
      element.setAttribute('aria-label', `${tagName}-${landmarkCounts[tagName]}`);
    } else if (landmarkCounts[tagName] === 0) {
      landmarkCounts[tagName]++;
    }
  });
}

// REACT_017: Implement this function for checking landmark elements
function checkLandmarkElements() {
  const landmarkSelectors = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
  const results = {
    totalLandmarks: landmarks.length,
    landmarksByType: {},
    issues: []
  };

  // Count landmarks by type
  landmarks.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    results.landmarksByType[tagName] = (results.landmarksByType[tagName] || 0) + 1;

    // Check for accessibility issues
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      results.issues.push({
        element: tagName,
        issue: 'Missing aria-label or aria-labelledby',
        id: element.id || 'no-id'
      });
    }
  });

  // Check for required landmarks
  const requiredLandmarks = ['header', 'nav', 'main', 'footer'];
  requiredLandmarks.forEach(landmark => {
    if (!results.landmarksByType[landmark]) {
      results.issues.push({
        element: landmark,
        issue: 'Missing required landmark',
        id: 'none'
      });
    }
  });

  return results;
}

function validateLandmark(landmark) {
  return true;
}

function validateLandmarkStructure(landmark) {
  return true;
}

function validateLandmarkAttributes(landmark) {
  return true;
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || '';
}

function setSvgAttributes(svg, name) {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('main, nav, aside, header, footer');
  const ids = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (ids[role]) {
      console.warn(`Duplicate landmark with role '${role}' found.`);
    }
    ids[role] = true;
  });
}

function validateLinkAccessibility(link) {
  return link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('aria-labelledby');
}

// REACT_036: Fix fake link issues (links without href or with javascript:void(0))
function fixFakeLinks() {
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      if (link.querySelector('button') || link.getAttribute('role') === 'button') {
        link.setAttribute('role', 'button');
        if (!link.id) {
          link.id = `button-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
      }
    }
  });
}

function handleFakeLinks() {
  document.querySelectorAll('a[role="button"]').forEach(link => {
    if (!link.hasAttribute('href')) {
      link.setAttribute('href', 'javascript:void(0)');
    }
  });
}

// REACT_040: Replace my-button with actual button id for accessibility
function replaceButtonIds() {
  const fakeButtons = document.querySelectorAll('[id="my-button"], .my-button');
  fakeButtons.forEach((button, index) => {
    const newId = `accessible-button-${index + 1}`;
    if (button.id === 'my-button') {
      button.id = newId;
    }
    if (button.classList.contains('my-button')) {
      button.classList.remove('my-button');
      button.classList.add(newId);
    }
  });
}

// REACT_042: Ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphAriaRole() {
  const dependencyGraph = document.querySelector('#dependencyGraph, .dependencyGraph, [data-dependency-graph]');
  if (dependencyGraph) {
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.getAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
}

function addProperLandmarkRegions() {
  const mainRegion = document.createElement('main');
  mainRegion.setAttribute('role', 'main');
  mainRegion.setAttribute('aria-label', 'Main content area');
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.appendChild(mainRegion);
  }
}

// REACT_037: Google sign-in logic
const googleSignIn = {
  initialize: function(clientId) {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleCredentialResponse.bind(this)
      });
      return true;
    }
    return false;
  },

  renderButton: function(elementId) {
    const element = document.getElementById(elementId);
    if (element && typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'sign_in_with'
      });
      return true;
    }
    return false;
  },

  handleCredentialResponse: function(response) {
    console.log('Google Sign-In successful');
    return response;
  }
};

// Configuration - merged
const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://example.com',
    timeout: 5000
};

// Alternative config style for backwards compatibility
const config = CONFIG;

// App state with accessibility updates
const appState = {
  initialized: false,
  data: null,
  cache: {},
  lang: 'en'
};

function existingFunction1() {
  // Existing implementation
}

function existingFunction2() {
  // Existing implementation
}

function newFunction() {
  // Implement the new functionality (as per the original commitment)
}

function function3() {
  // TODO: Implement new function
}

// Validate input helper
function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

// Initialize function
function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

// Initialize app function
function initializeApp() {
  initialize();
  return appState;
}

// Fetch user function
async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

// Clear cache function
function clearCache() {
  appState.cache.clear();
}

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// Helper function to format dates
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

// Validate input helper
function validateInputFn(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processDataFn(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

// Some function
function someFunction() {
  return 'some function';
}

// Landmark processing functions
function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
  return landmarks.slice().sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (ascending) {
      return nameA.localeCompare(nameB);
    }
    return nameB.localeCompare(nameA);
  });
}

function getLandmarkById(landmarks, id) {
  return landmarks.find(landmark => landmark.id === id) || null;
}

function generateAccessibilityReport(issuesData) {
  const issues = [];
  if (issuesData && Array.isArray(issuesData)) {
    issues.push(...issuesData);
  }

  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: 'img',
        index: index,
        message: `Image at index ${index} is missing an alt attribute`
      });
    }
  });

  const buttons = document.querySelectorAll('button');
  buttons.forEach((btn, index) => {
    const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
    if (!accessibleName) {
      issues.push({
        type: 'missing-name',
        element: 'button',
        index: index,
        message: `Button at index ${index} is missing an accessible name`
      });
    }
  });

  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('aria-labelledby');
    if (!accessibleName) {
      issues.push({
        type: 'missing-name',
        element: 'a',
        index: index,
        message: `Link at index ${index} is missing an accessible name`
      });
    }
  });

  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const inputType = input.getAttribute('type');
    if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
      const labelId = input.getAttribute('aria-labelledby');
      const labelText = input.getAttribute('aria-label');
      const hasLabel = document.querySelector(`label[for="${input.id}"]`) || labelId || labelText;
      if (!hasLabel) {
        issues.push({
          type: 'missing-label',
          element: 'input',
          index: index,
          message: `Input at index ${index} is missing an associated label`
        });
      }
    }
  });

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    if (!heading.textContent.trim()) {
      issues.push({
        type: 'empty-heading',
        element: heading.tagName.toLowerCase(),
        index: index,
        message: `${heading.tagName.toLowerCase()} at index ${index} has no text content`
      });
    }
  });

  const report = {
    introduction: 'Accessibility report for the application',
    data: issues,
    conclusions: issues.length === 0 ? 'No accessibility issues found.' : `${issues.length} accessibility issues found.`,
    timestamp: new Date().toISOString(),
    totalIssues: issues.length
  };

  console.log('Accessibility Report:', report);
  return report;
}

function addressAccessibilityIssues() {
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
    rootContainer.setAttribute('aria-label', 'Main content area');
  }

  const skipLink = document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  document.querySelectorAll('[role="button"]').forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });

  const modal = document.getElementById('modal');
  if (modal) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
  }

  a11y.announce('Welcome to the bot!', 'assertive');

  const imageElement = document.querySelector('img[alt=""]');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  const divElement = document.querySelector('div[role="list"]');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  addLangAttribute();
}

// Accessibility functions
function addKeyboardNavigation() {
  // Implementation for keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Handle keyboard events
  });
}

// Add ARIA labels
function addAriaLabels() {
  const elements = document.querySelectorAll('[data-label]');
  elements.forEach(el => {
    el.setAttribute('aria-label', el.getAttribute('data-label'));
  });
}

// Add screen reader announcements
function addScreenReaderAnnouncements() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
}

// Add focus trap
function addFocusTrap() {
  const focusableElements = document.querySelectorAll('a, button, input, [tabindex]');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });
}

// Improve accessibility
function improveAccessibility() {
  fixTableStructure();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinks();
  ensureUniqueLandmarks();
  fixLandmarks();
}

// Exports for testing
module.exports = {
  getLangAttribute,
  addLangAttribute,
  ensureLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  fixLandmarks,
  checkLandmarkElements,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  fixFakeLinks,
  handleFakeLinks,
  replaceButtonIds,
  addProperLandmarkRegions,
  ensureDependencyGraphAriaRole,
  googleSignIn,
  CONFIG,
  config,
  appState,
  validateInput,
  processData,
  initialize,
  initializeApp,
  fetchUser,
  clearCache,
  existingFunction1,
  existingFunction2,
  newFunction,
  function3,
  someFunction,
  helper,
  formatDate,
  validateInputFn,
  processDataFn,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  generateAccessibilityReport,
  addressAccessibilityIssues,
  addKeyboardNavigation,
  addAriaLabels,
  addScreenReaderAnnouncements,
  addFocusTrap,
  improveAccessibility
};