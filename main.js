const utils = require('./utils');
const express = require('express');
const axe = require('axe-core');
const fastMap = require('fast-map');
const path = require('path');
const { a11y, calculateSum, UserSafety, getSafetyCategory, getSafetyCategoryDetailed, getUserSafetyInfo, isUserSafetyUnsafe, hasSafetyCategory, loadUserSafetyInfo } = require('./userSafety');

const appData = {
    title: 'Frontend Application',
    version: '1.0.0',
};

let userSafety = 'unsafe';
let safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];

let books = [];

const initializeApp = () => {
  console.log('Application initialized');

  addressAccessibilityIssues();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      console.log('Tab pressed');
    }
  });

  document.addEventListener('click', () => {
    console.log('Click event');
  });
};

/**
 * Creates an in-page button element with optional click handler.
 * @param {Object|string} options - Options object or button text (for backward compatibility)
 * @param {string} [options.text='Button'] - The label text for the button
 * @param {Function} [options.onClick=null] - Callback function triggered when the button is clicked
 * @param {string} [options.className='in-page-button'] - CSS class for the button
 * @param {string} [options.id=null] - Unique identifier for the button
 * @param {boolean} [options.disabled=false] - Whether the button is disabled
 * @param {string} [options.type='button'] - Button type attribute
 * @param {string} [options.ariaLabel=null] - ARIA label for accessibility
 * @param {string} [options.title=null] - Title attribute for tooltip
 * @param {string} [targetId] - Target element ID (for scroll-to functionality)
 * @returns {HTMLElement} The created button element
 */
const createInPageButton = (options, targetId) => {
  // Handle backward compatibility: if first arg is string, treat as targetId/text
  if (typeof options === 'string') {
    const text = targetId || options;
    const button = document.createElement('button');
    button.textContent = text;
    if (options !== text) { // first arg was targetId
      button.addEventListener('click', () => {
        const target = document.getElementById(options);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    return button;
  }

  const {
    text = 'Button',
    onClick = null,
    className = 'in-page-button',
    id = null,
    disabled = false,
    type = 'button',
    ariaLabel = null,
    title = null
  } = options || {};

  const button = document.createElement('button');
  button.type = type;
  button.textContent = text;

  if (id) {
    button.id = id;
  }

  button.className = className;
  button.disabled = disabled;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  if (title) {
    button.title = title;
  }

  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
};

const exportedFunction1 = () => {
  // Exported function implementation
};

const exportedFunction2 = () => {
  // Exported function implementation
};

const checkUserSafety = () => {
  let userSafetyMessage = '';
  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }
  return userSafetyMessage;
};

const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';
  if (safetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }
  return safetyCategoriesMessage;
};

const upgradeUserSettings = () => {
  let upgradeMessage = '';
  const upgrades = [];

  if (userSafety !== 'safe') {
    upgrades.push({ field: 'userSafety', from: userSafety, to: 'safe' });
  }

  if (safetyCategories.includes('Unauthorized Advice')) {
    upgrades.push({ field: 'safetyCategories', from: safetyCategories, to: ['Authorized Advice'] });
  }

  if (upgrades.length > 0) {
    upgradeMessage = `Upgrade needed: ${upgrades.length} setting(s) require update.`;
  }

  return {
    message: upgradeMessage,
    upgrades: upgrades,
    requiresUpgrade: upgrades.length > 0
  };
};

const updateAccessibilityFeatures = () => {
  // New function to update accessibility features
  // Example code to demonstrate the new functionality
  // This is a placeholder and should be replaced with actual implementation
  console.log('Accessibility features updated.');
};

const getUserSafetyAdvice = () => {
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
};

const addBook = (title, author) => {
  const bookObject = { title, author };
  books.push(bookObject);

  announceBookAdded(title, author);

  return bookObject;
};

const announceBookAdded = (title, author) => {
  console.log(`A new book has been added: "${title}" by "${author}".`);
};

const getBooksList = () => {
  let booksList = [];

  books.forEach((book, index) => {
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });

  return booksList.join("\n");
};

function ensureElementHasId(element, prefix = 'element') {
  if (!element) return null;

  if (!element.id) {
    const id = prefix + Math.random().toString(36).substring(2, 9);
    element.id = id;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (!element || !label) return false;

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
    return true;
  }
  return false;
}

function renderDependencyGraph(container, dependencies = [], options = {}) {
  // ... (implementation)
}

function getDependencies(root) {
  // ... (implementation)
}

function getLangAttribute(element) {
  return element.getAttribute('lang') || 'en';
}

function addLangAttribute(element, lang) {
  if (lang && !element.getAttribute('lang')) {
    element.setAttribute('lang', lang);
  }
}

// Helper functions
function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

function loadLandmarks() {
  try {
    const filePath = CONFIG.dataPath + '/landmarks.json';
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(validateLandmark);
  const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function ensureUniqueLandmarksList(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seenIds = new Set();
  return landmarks.filter(landmark => {
    if (seenIds.has(landmark.id)) {
      return false;
    }
    seenIds.add(landmark.id);
    return true;
  });
}

function fixAccessibilityIssues() {
  // Add your code here to fix the accessibility issues as per the insight report
  // Example: validateTableAccessibility(/* table to validate */);
}

function ensureUniqueLandmarksDom() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  const landmarkCounts = ensureUniqueLandmarks(landmarks);

  // ... (existing code for handling invalid landmarks)
}

const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  },

  addBook: function(title, author, isbn) {
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add Book Form');

    const titleInput = createAccessibleInput('text', 'title', 'Book Title', title);
    const authorInput = createAccessibleInput('text', 'author', 'Author Name', author);
    const isbnInput = createAccessibleInput('text', 'isbn', 'ISBN Number', isbn);

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('aria-label', 'Add Book');
    submitButton.textContent = 'Add Book';

    form.appendChild(titleInput);
    form.appendChild(authorInput);
    form.appendChild(isbnInput);
    form.appendChild(submitButton);

    document.body.appendChild(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Book added:', {
        title: titleInput.value,
        author: authorInput.value,
        isbn: isbnInput.value
      });
    });

    return form;
  }
};

function renderDependencyGraph(container) {
  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', 'Dependency Graph Visualization');
  
  const heading = document.createElement('h2');
  heading.textContent = 'Dependency Graph';
  graphContainer.appendChild(heading);
  
  const list = document.createElement('ul');
  list.setAttribute('role', 'list');
  graphContainer.appendChild(list);
  
  container.appendChild(graphContainer);
}

function renderIndexView(container) {
  const indexContainer = document.createElement('div');
  indexContainer.setAttribute('role', 'navigation');
  indexContainer.setAttribute('aria-label', 'Dependency Index');
  
  const heading = document.createElement('h2');
  heading.textContent = 'Dependency Index';
  indexContainer.appendChild(heading);
  
  container.appendChild(indexContainer);
}

function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

function addLandmarkRoles(container) {
  if (!container) return;
}

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.ariaLabel = 'rotate back';
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.querySelector('a[href="#"]');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }
  const seenIds = new Set();
  return elements.filter(element => {
    if (element && 'id' in element) {
      if (seenIds.has(element.id)) {
        return false;
      }
      seenIds.add(element.id);
      return true;
    }
    return false;
  });
}

// Updated function using the new functions for rendering graph/index

function ensureUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  const landmarkCounts = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
  });

  Object.keys(landmarkCounts).forEach(role => {
    if (landmarkCounts[role] > 1) {
      console.warn(`Multiple ${role} landmarks detected. Only one ${role} should be present per page.`);
    }
  });

  return landmarkCounts;
}

function fixFakeLinkIssue(container) {
  const fakeLinks = container.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
      const href = link.getAttribute('data-href');
      if (href) {
        link.setAttribute('href', href);
      } else {
        const onclick = link.getAttribute('onclick');
        if (onclick) {
          link.setAttribute('role', 'button');
        }
      }
    }
  });
}

function addAccessibleNamesToSVGs(container) {
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = 'svg-title-' + index;
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', 'SVG image ' + (index + 1));
      }
    }
  });
}

function addressAccessibilityIssues() {
  const accessibilityIssues = [
    {
      action: (context) => addLandmarkRoles(context),
      context: document.body
    },
    {
      action: (context) => ensureUniqueLandmarks(context),
      context: document.body
    },
    {
      action: (context) => fixFakeLinkIssue(context),
      context: document.body
    },
    {
      action: (context) => addAccessibleNamesToSVGs(context),
      context: document.body
    }
  ];

  accessibilityIssues.forEach((issue) => {
    if (issue.context) {
      issue.action(issue.context);
    }
  });
}

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// Function to enhance accessibility for addBook form
function enhanceAddBookFormAccessibility(formElement) {
  if (!formElement) return;

  // Add ARIA attributes to form elements
  formElement.setAttribute('role', 'form');
  formElement.setAttribute('aria-label', 'add-book-form-title');

  // Find and enhance form controls
  const inputs = formElement.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    // Add required attribute if needed
    if (input.required) {
      input.setAttribute('aria-required', 'true');
    }

    // Add labels if missing
    if (!input.id) {
      input.id = 'input_' + Math.random().toString(36).substr(2, 9);
    }
  });
}

const CONFIG = {
  dataPath: './',
  maxResults: 10
};

const axeConfig = {
  // default configuration
};

module.exports = {
  utils,
  express,
  axe,
  fastMap,
  path,
  a11y,
  calculateSum,
  UserSafety,
  getSafetyCategory,
  getSafetyCategoryDetailed,
  getUserSafetyInfo,
  isUserSafetyUnsafe,
  hasSafetyCategory,
  loadUserSafetyInfo,
  main,
  fixAccessibilityIssues,
  ensureUniqueLandmarksDom,
  addressAccessibilityIssues,
  renderDependencyGraph,
  renderIndexView,
  renderDependencyGraphContent,
  initializeApp,
  ensureElementHasId,
  addAriaLabel,
  getDependencies,
  CONFIG,
  getLangAttribute,
  addLangAttribute,
  createInPageButton,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addAccessibleNamesToSVGs,
  axeConfig,
  upgradeUserSettings,
  appData,
  checkUserSafety,
  checkSafetyCategories,
  exportedFunction1,
  exportedFunction2,
  updateAccessibilityFeatures,
  getUserSafetyAdvice,
  addBook,
  announceBookAdded,
  getBooksList,
  countDependencies,
  enhanceAddBookFormAccessibility,
  rotateBack
};