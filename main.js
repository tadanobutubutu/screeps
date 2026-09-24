import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import { getRootHtmlAccessibilityProps, getLandmarkProps, getSvgAccessibilityProps, getAccessibleLinkProps } from './accessibility';

// TODO: This is the existing code that needs to be preserved (This comment remains as-is)

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

  // Ensure proper contrast ratios
  const style = window.getComputedStyle(element);
  const bgColor = style.backgroundColor;
  const textColor = style.color;

  // Simple contrast check (in a real app, use a proper contrast ratio calculator)
  if (bgColor && textColor) {
    // This is a simplified example - real implementation would need proper color parsing
    if (bgColor === 'rgb(255, 255, 255)' && textColor === 'rgb(0, 0, 0)') {
      element.style.color = '#333333'; // Darker text for better contrast
    }
  }

  // Add keyboard navigation support
  element.setAttribute('tabIndex', '0');

  // Add focus styles for keyboard users
  const focusStyle = document.createElement('style');
  focusStyle.textContent = `
    [tabindex="0"]:focus {
      outline: 2px solid #0066cc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(focusStyle);

  return element;
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
  const landmarks = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    footer: 'contentinfo',
    aside: 'complementary',
    section: 'region',
    article: 'article'
  };

  Object.keys(landmarks).forEach(tag => {
    document.querySelectorAll(tag).forEach(element => {
      if (!element.hasAttribute('role')) {
        element.setAttribute('role', landmarks[tag]);
      }
    });
  });
}

// New function for REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'region', 'article'];
  const roleCounts = {};

  landmarkRoles.forEach(role => {
    roleCounts[role] = 0;
  });

  document.querySelectorAll('[role]').forEach(element => {
    const role = element.getAttribute('role');
    if (landmarkRoles.includes(role)) {
      roleCounts[role]++;
      if (roleCounts[role] > 1 && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        element.setAttribute('aria-label', `${role}-${roleCounts[role]}`);
      }
    }
  });
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

  books.forEach(book => {
    graph[book.id] = {
      title: book.title,
      dependencies: book.dependencies || []
    };
  });

  // Dispatch the updated graph to Redux store
  dispatch(setDependencyGraph(graph));
}

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