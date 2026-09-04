const { dependencyGraphContent, indexContent } = require('./dependencyContent');
const {
  renderGraphIndex,
  checkAccessibilityForReport,
  trapFocus,
  addLandmarkRegions,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  addAccessibleName,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ...utilitiesFunctionsRest
} = require('./utilities');
const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');

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
    title = null,
    targetId: internalTargetId
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

  if (internalTargetId) {
    button.setAttribute('data-target-id', internalTargetId);
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

const addressAccessibilityIssues = () => {
  checkAccessibilityForReport();
  trapFocus();
  addLandmarkRegions();
  prefersReducedMotion();
  renderSimpleDependencyGraph();
  addAccessibleName();
  addAccessibleNamesToSVGs();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
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
const { CONFIG, config, appState, ...restOfFunctions } = utilitiesFunctionsRest;

module.exports = {
  ...restOfFunctions,
  addressAccessibilityIssues,
  addBook,
  announceBookAdded,
  getBooksList,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  getDependencies,
  getLangAttribute,
  addLangAttribute,
  appData,
};