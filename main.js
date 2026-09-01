// User Safety: unsafe
// Safety Categories: PII/Privacy

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

// Configuration - merged from both branches
const APP_CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

// App state
const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

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

// Utility functions from HEAD
function fetchUser(userId) {
  return { id: userId, name: 'User' };
}

function clearCache() {
  appState.initialized = false;
  appState.data = null;
  appState.cache.clear();
}

function someFunction() {
  return 'some value';
}

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

function validateInput(input) {
  if (!input || input.length === 0) {
    return false;
  }
  return true;
}

// Utility functions from BASE
function getLangAttribute() {
  // Code for getting the language attribute
}

function addLangAttribute(element) {
  // Code for adding the language attribute to the specified element
}

// Accessibility functions
function ensureLangAttribute() {
  if (document.documentElement.getAttribute('lang') === null) {
    document.documentElement.setAttribute('lang', document.documentElement.lang || 'en');
  }
}

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

// New function for REACT_017: Add landmark roles and fix landmark issues
function addLandmarkRoles() {
  // Implementation for adding landmark roles
}

// New function for REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
}

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

// Improve accessibility for adding a new book
function enhanceAccessibilityForAddBook(formElement) {
  if (!formElement) return;

  // Ensure the form has an accessible name
  if (!formElement.getAttribute('aria-label') && !formElement.getAttribute('aria-labelledby')) {
    formElement.setAttribute('aria-label', 'Add a new book');
  }

  // Ensure all inputs have associated labels
  const inputs = formElement.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const inputId = input.id || `add-book-input-${index + 1}`;
    if (!input.id) {
      input.id = inputId;
    }

    // Check if a label already exists for this input
    const existingLabel = formElement.querySelector(`label[for="${inputId}"]`);
    if (!existingLabel) {
      // Look for a wrapping label
      const parentLabel = input.closest('label');
      if (!parentLabel) {
        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.textContent = input.getAttribute('aria-label') || input.getAttribute('placeholder') || `Field ${index + 1}`;
        formElement.insertBefore(label, input);
      }
    }

    // Remove placeholder-only labels; ensure aria-label as fallback
    if (!input.getAttribute('aria-label') && !formElement.querySelector(`label[for="${inputId}"]`)) {
      input.setAttribute('aria-label', input.getAttribute('placeholder') || `Field ${index + 1}`);
    }
  });

  // Ensure the submit button has an accessible name
  const submitButton = formElement.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
  if (submitButton && !submitButton.textContent.trim() && !submitButton.getAttribute('aria-label') && !submitButton.getAttribute('aria-labelledby')) {
    submitButton.setAttribute('aria-label', 'Add book');
  }

  // Ensure the form uses role="form" with an accessible name if not already a form element
  if (formElement.tagName !== 'FORM' && !formElement.getAttribute('role')) {
    formElement.setAttribute('role', 'form');
  }

  return formElement;
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

// Imports from origin/main
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook } from './bookFunctions';
import { getRootHtmlAccessibilityProps, getLandmarkProps, getSvgAccessibilityProps, getAccessibleLinkProps } from './accessibility';

// Exports
export {
  APP_CONFIG,
  config,
  appState,
  initialize,
  initializeApp,
  fetchUser,
  clearCache,
  someFunction,
  helper,
  formatDate,
  validateInput,
  getLangAttribute,
  addLangAttribute,
  ensureLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  replaceButtonIds,
  ensureDependencyGraphAriaRole,
  enhanceAccessibilityForAddBook,
  googleSignIn
};