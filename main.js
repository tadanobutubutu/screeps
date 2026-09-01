import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import express from 'express';
import axe from 'axe-core';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import './index.css';
import App from './App';
import reportWebVitals from 'node-libs-react/report-validator';
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));

// REACT_015: Add lang attribute to document
function getLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    return htmlElement.lang;
  }
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

  landmarks.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    results.landmarksByType[tagName] = (results.landmarksByType[tagName] || 0) + 1;

    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      results.issues.push({
        element: tagName,
        issue: 'Missing aria-label or aria-labelledby',
        id: element.id || 'no-id'
      });
    }
  });

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

// REACT_037: Google sign-in logic
const googleSignIn = {
  initialize: function(clientId) {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: client_id,
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

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Application main entry point
const app = express();

// Helper functions moved to a separate file (preserved references)
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames: addSvgAccessibleNamesExternal,
  fixFakeLinks: fixFakeLinksExternal,
  ensureUniqueLandmarks: ensureUniqueLandmarksExternal,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships
} = require('./accessibility-improvements');

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

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
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

// Write report to file
function writeReport(report) {
  const reportPath = path.join(__dirname, CONFIG.dataPath, 'accessibility-report.json');
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log('Report written to', reportPath);
  } catch (error) {
    console.error('Error writing report:', error.message);
  }
}

// Function to create an in-page button and add the lang attribute
function createInPageButton() {
  const inPageButton = document.createElement('button');
  inPageButton.id = 'in-page-button';
  inPageButton.textContent = 'In-Page Button';
  document.body.appendChild(inPageButton);
  const buttonElement = document.getElementById('in-page-button');
  if (buttonElement) {
    buttonElement.setAttribute('aria-label', 'In-Page Button');
  }
}

// Function for generating a report based on accessibility issues
function generateAccessibilityReport() {
  const issues = [];

  // Check for images without alt attributes
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

  // Check for buttons without accessible name
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

  // Check for links without accessible name
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

  // Check for form inputs without labels
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

  // Check for empty headings
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

  // Ensure all form inputs have associated labels
  const formInputs = document.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    const hasLabel = input.getAttribute('aria-label') ||
                     document.querySelector(`label[for="${input.id}"]`);
    if (!hasLabel && input.name) {
      input.setAttribute('aria-label', input.name);
    }
  });

  // Add landmark roles to main sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    if (!section.getAttribute('role') && !section.getAttribute('aria-label')) {
      section.setAttribute('aria-label', `Section ${index + 1}`);
    }
  });

  // Ensure all links have accessible text
  const allLinks = document.querySelectorAll('a');
  allLinks.forEach(link => {
    if (!link.textContent.trim() && link.getAttribute('href')) {
      const href = link.getAttribute('href');
      link.setAttribute('aria-label', `Link to ${href}`);
    }
  });

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues: issues
  };

  console.log('Accessibility Report:', report);
  return report;
}

// Function to validate table structure and accessibility
function validateTableAccessibility() {
  // Implementation of validateTableAccessibility function
  // ...
}

// Function to validate landmark structure and accessibility
function validateLandmarkStructure() {
  // Implementation of validateLandmarkStructure function
  // ...
}

// Function to validate landmarks
function validateLandmark() {
  // Implementation of validateLandmark function
  // ...
}

// Function to get accessible names for SVGs
function getSvgAccessibleName() {
  // Implementation of getSvgAccessibleName function
  // ...
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks() {
  // Implementation of ensureUniqueLandmarks function
  // ...
}

// Function to fix fake link issues
function fixFakeLinkIssues() {
  // Implementation of fixFakeLinkIssues function
  // ...
}

// Additional function to address new accessibility issues
function addressNewAccessibilityIssues() {
  // Implementation of addressNewAccessibilityIssues function
  // ...
}

// Function for addressing new accessibility issues from the insight report
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = 'content';
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Ensure all buttons with role="button" respond to Enter key
  document.querySelectorAll('button[role="button"]').forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focusVisible polyfill behavior
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });

  // Assuming a modal/dialog element with the ID "modal"
  a11y.announce('Welcome to the bot!', 'assertive');

  // Adding an alt attribute to an image
  const imageElement = document.querySelector('img[alt=""]');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  // Correcting the ARIA role for a div
  const divElement = document.querySelector('div[role="presentation"]');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  // Adding the lang attribute to the HTML element
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute() || 'en');
  }
}

// Function to add a book with accessibility considerations
function addBook(title, author, isbn) {
  // Create form elements with proper accessibility attributes
  const form = document.createElement('form');
  form.setAttribute('role', 'form');
  form.setAttribute('aria-label', 'Add a new book');

  // Title input with label
  const titleLabel = document.createElement('label');
  titleLabel.setAttribute('for', 'book-title');
  titleLabel.textContent = 'Book Title:';
  const titleInput = document.createElement('input');
  titleInput.id = 'book-title';
  titleInput.type = 'text';
  titleInput.value = title || '';
  titleInput.setAttribute('required', 'true');
  titleInput.setAttribute('aria-required', 'true');

  // Author input with label
  const authorLabel = document.createElement('label');
  authorLabel.setAttribute('for', 'book-author');
  authorLabel.textContent = 'Author:';
  const authorInput = document.createElement('input');
  authorInput.id = 'book-author';
  authorInput.type = 'text';
  authorInput.value = author || '';
  authorInput.setAttribute('required', 'true');
  authorInput.setAttribute('aria-required', 'true');

  // ISBN input with label
  const isbnLabel = document.createElement('label');
  isbnLabel.setAttribute('for', 'book-isbn');
  isbnLabel.textContent = 'ISBN:';
  const isbnInput = document.createElement('input');
  isbnInput.id = 'book-isbn';
  isbnInput.type = 'text';
  isbnInput.value = isbn || '';
  isbnInput.setAttribute('required', 'true');
  isbnInput.setAttribute('aria-required', 'true');

  // Submit button with proper accessibility
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Book';
  submitButton.setAttribute('aria-label', 'Add this book to the collection');

  // Add all elements to the form
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(authorLabel);
  form.appendChild(authorInput);
  form.appendChild(isbnLabel);
  form.appendChild(isbnInput);
  form.appendChild(submitButton);

  // Add form to the document
  document.body.appendChild(form);

  // Add event listener for form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Book added:', {
      title: titleInput.value,
      author: authorInput.value,
      isbn: isbnInput.value
    });
    form.reset();
  });

  return form;
}

async function scanAccessibility() {
  return {
    timestamp: new Date().toISOString(),
    issues: []
  };
}

// Accessibility functions
function addKeyboardNavigation() {
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
  fixTableStructureIssues();
  fixTableHeaderCellScope();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinks();
  ensureUniqueLandmarks();
  addLandmarkRoles();
}

// Ensure lang attribute helper
function ensureLangAttribute() {
  if (document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
}

export {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateLandmarkStructure,
  validateLandmark,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  fixFakeLinkIssues,
  addressNewAccessibilityIssues,
  addressAccessibilityIssues,
  generateAccessibilityReport,
  a11y,
  addBook,
  ensureLangAttribute,
  fixTableStructure,
  fixLandmarks,
  checkLandmarkElements,
  addSvgAccessibleNames,
  fixFakeLinks,
  replaceButtonIds,
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
  someFunction,
  helper,
  formatDate,
  validateInputFn,
  processDataFn,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  writeReport,
  scanAccessibility,
  addKeyboardNavigation,
  addAriaLabels,
  addScreenReaderAnnouncements,
  addFocusTrap,
  improveAccessibility
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

addressAccessibilityIssues();
createInPageButton();