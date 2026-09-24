// main.js

// Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && !primaryContent.closest('main')) {
    // Create a new <main> element
    const mainElement = document.createElement('main');

    // Insert the <main> element before the primary content in the DOM
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);

    // Move the primary content inside the <main> element
    mainElement.appendChild(primaryContent);

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

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
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.querySelector('selector');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en-US';
}

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return null;
}

// TODO: Any additional changes requested in the issue should be added after this function

// Function to handle additional changes requested in the issue
function handleAdditionalChanges() {
  // This function will contain any additional changes requested in the issue
  // The implementation will be added here as needed
  console.log('Handling additional changes requested in the issue');
}

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import fs from 'fs';
import './styles.css';
import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import App from './App';
import { helper, formatDate } from './utils';
import { someFunction } from './utils/someFunction';
import express from 'express';
import path from 'path';
import { fetchUser, clearCache } from './utils/user';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (!elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

// Implemented validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate landmark structure
function landmarkStructureCheck(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Check for required properties
  if (!landmark.role) {
    errors.push('Landmark must have a role');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

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
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarkTypes = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

// Function to ensure focusable elements
function ensureFocusableElements(container) {
  if (!container) return;

  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
  const focusableElements = container.querySelectorAll(focusableSelectors);

  focusableElements.forEach((el, index) => {
    if (!el.getAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });

  return focusableElements;
}

// New function for creating in-page buttons
function createInPageButtons(buttonsData) {
  const buttonsContainer = document.getElementById('in-page-buttons-container');

  if (!buttonsContainer) {
    console.error('In-page buttons container not found');
    return;
  }

  buttonsData.forEach(buttonData => {
    const button = document.createElement('button');
    button.id = buttonData.id;
    button.textContent = buttonData.text;
    button.setAttribute('data-role', buttonData.role);

    button.addEventListener('click', () => {
      location.hash = buttonData.href;
    });

    buttonsContainer.appendChild(button);
  });
}

// Function to set language attribute
function setLanguageAttribute(document, lang) {
  if (document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
}

// Function to add landmark roles
function addLandmarkRoles(container) {
  if (!container) return;

  const possibleLandmarks = {
    'nav': 'navigation',
    'aside': 'complementary',
    'section': 'region',
    'form': 'form'
  };

  const sections = container.querySelectorAll('nav, aside, section, form');
  sections.forEach(section => {
    if (!section.getAttribute('role') && possibleLandmarks[section.tagName.toLowerCase()]) {
      section.setAttribute('role', possibleLandmarks[section.tagName.toLowerCase()]);
    }
  });
}

// Function to fix fake links
function fixFakeLinks(container) {
  if (!container) return;

  const fakeLinks = container.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Handle as button click
      });
    }
  });
}

// New function to add a book with accessibility features
function addBookWithAccessibility(bookData) {
  const booksContainer = document.getElementById('books-container');

  if (!booksContainer) {
    console.error('Books container not found');
    return;
  }

  // Create book element with proper ARIA attributes
  const bookElement = document.createElement('div');
  bookElement.className = 'book';
  bookElement.setAttribute('role', 'article');
  bookElement.setAttribute('aria-label', `Book: ${bookData.title}`);

  // Create title element with proper heading level
  const titleElement = document.createElement('h3');
  titleElement.textContent = bookData.title;
  titleElement.setAttribute('id', `book-title-${bookData.id}`);
  bookElement.appendChild(titleElement);

  // Create author element with proper label
  const authorElement = document.createElement('p');
  authorElement.textContent = `Author: ${bookData.author}`;
  authorElement.setAttribute('aria-labelledby', `book-title-${bookData.id}`);
  bookElement.appendChild(authorElement);

  // Create description element with proper label
  const descElement = document.createElement('p');
  descElement.textContent = bookData.description;
  descElement.setAttribute('aria-describedby', `book-title-${bookData.id}`);
  bookElement.appendChild(descElement);

  // Basic validation: ensure at least one main landmark exists
  if (mainCount === 0) {
    console.warn('No main landmark found on the page');
    return false;
  }

  // Ensure no duplicate landmark IDs (reusing previous function)
  ensureUniqueLandmarks();

  return true;
}

// New function to get language attribute
function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || 'en';
}

// New function to add language attribute
function addLangAttribute(lang = 'en') {
  document.documentElement.setAttribute('lang', lang);
}

// New function to validate table accessibility
function validateTableAccessibility(table) {
  if (!table) return false;

  // Check if table has a caption
  const hasCaption = table.querySelector('caption') !== null;

  // Check if table has proper headers
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;

  // Check if table has proper scope attributes for headers
  let hasScope = true;
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      hasScope = false;
    }
  });

  return hasCaption && hasHeaders && hasScope;
}

// New function to validate table structure
function validateTableStructure(table) {
  if (!table) return false;

  // Check if table has proper row structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) return false;

  // Check if first row has th elements (header row)
  const firstRow = rows[0];
  const headerCells = firstRow.querySelectorAll('th');
  if (headerCells.length === 0) return false;

  // Check if all rows have proper cell count
  const cellCount = headerCells.length;
  let isValid = true;
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length !== cellCount) {
      isValid = false;
    }
  });

  return isValid;
}

// New function to fix table structure
function fixTableStructure(table) {
  if (!table) return;

  // Add caption if missing
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption';
    table.prepend(caption);
  }

  // Add scope to headers if missing
  const headers = table.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });

  // Ensure all rows have proper cell count
  const rows = table.querySelectorAll('tr');
  if (rows.length > 0) {
    const firstRow = rows[0];
    const headerCells = firstRow.querySelectorAll('th');
    const cellCount = headerCells.length;

    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length < cellCount) {
        // Add missing cells
        const missingCount = cellCount - cells.length;
        for (let i = 0; i < missingCount; i++) {
          const newCell = document.createElement('td');
          newCell.textContent = ' ';
          row.appendChild(newCell);
        }
      }
    });
  }
}

// New function to add main landmark
function addMainLandmark() {
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    const newMain = document.createElement('main');
    newMain.setAttribute('role', 'main');
    document.body.prepend(newMain);
  } else if (!mainElement.hasAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }
}

// New function to get SVG accessible name
function getSvgAccessibleName(svg) {
  if (!svg) return '';

  // Check for title element
  const title = svg.querySelector('title');
  if (title) return title.textContent.trim();

  // Check for aria-label
  if (svg.hasAttribute('aria-label')) {
    return svg.getAttribute('aria-label').trim();
  }

  // Check for aria-labelledby
  if (svg.hasAttribute('aria-labelledby')) {
    const id = svg.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    if (labelElement) return labelElement.textContent.trim();
  }

  return '';
}

// New function to set SVG attributes
function setSvgAttributes(svg, name) {
  if (!svg || !name) return;

  // Set aria-label if not already set
  if (!svg.hasAttribute('aria-label')) {
    svg.setAttribute('aria-label', name);
  }

  // Add title element if not present
  if (!svg.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = name;
    svg.prepend(title);
  }
}

// New function to validate link accessibility
function validateLinkAccessibility(link) {
  if (!link) return false;

  // Check if link has text content
  const hasText = link.textContent.trim().length > 0;

  // Check if link has aria-label if it's an icon-only link
  const hasAriaLabel = link.hasAttribute('aria-label') && link.getAttribute('aria-label').trim().length > 0;

  // Check if link has proper href
  const hasHref = link.hasAttribute('href') && link.getAttribute('href').trim().length > 0;

  return (hasText || hasAriaLabel) && hasHref;
}

// New function to handle fake links
function handleFakeLinks() {
  const links = document.querySelectorAll('a[href="#"]');

  links.forEach(link => {
    // If link has no click handler, make it a button
    if (!link.onclick && !link.hasAttribute('onclick')) {
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.className = link.className;
      link.replaceWith(button);
    }
  });
}

/**
 * Adds fixes for landmark issues throughout the page
 * @returns {boolean} True if fixes were applied
 */
function addFixLandmarkIssues() {
  // Apply any necessary fixes for landmark accessibility
  // This could include adding missing roles, labels, etc.

  // Example: Find all main landmarks and ensure they have proper roles
  const mainLandmarks = document.querySelectorAll('[role="main"]');
  mainLandmarks.forEach(landmark => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', 'Main content area');
    }
  });

  // Add click handler
  bookElement.addEventListener('click', () => {
    // Handle book selection
    console.log(`Book selected: ${bookData.title}`);
  });

  booksContainer.appendChild(bookElement);
}

// Register the service worker
registerSW();

  if (!svg) {
    errors.push('SVG element is required');
    return { valid: false, errors };
  }

  // Check for accessible name
  const accessibleName = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title');
  if (!accessibleName) {
    errors.push('SVG must have an accessible name via aria-label, aria-labelledby, or title element');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Process unique elements
function processUniqueElements(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
}

// Address insight issues
function addressInsightIssues(document) {
  const issues = [];

// New function to add proper landmark regions
function addProperLandmarkRegions() {
  // Add main landmark if missing
  addMainLandmark();

  // Add navigation landmark if missing
  const navElement = document.querySelector('nav');
  if (!navElement) {
    const newNav = document.createElement('nav');
    newNav.setAttribute('role', 'navigation');
    document.body.prepend(newNav);
  } else if (!navElement.hasAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }

  // Add contentinfo landmark if missing
  const footerElement = document.querySelector('footer');
  if (!footerElement) {
    const newFooter = document.createElement('footer');
    newFooter.setAttribute('role', 'contentinfo');
    document.body.appendChild(newFooter);
  } else if (!footerElement.hasAttribute('role')) {
    footerElement.setAttribute('role', 'contentinfo');
  }
}

// New function to address all insight issues
function addressInsightIssues() {
  // Add lang attribute
  addLangAttribute();

  // Fix table issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!validateTableAccessibility(table) || !validateTableStructure(table)) {
      fixTableStructure(table);
    }
  });

  // Add/fix landmarks
  addProperLandmarkRegions();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      setSvgAttributes(svg, 'Graphic element');
    }
  });

  // Fix fake links
  handleFakeLinks();
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  replaceFakeLinks();

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  addSvgAccessibleNames();

  // Render graph and index using the new functions
  renderGraph();
  renderIndex();
}

// Helper function to replace fake links with proper buttons
function replaceFakeLinks() {
  const fakeLink = document.querySelector('selector');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Address REACT_017: Add/fix landmark issues
  const mainLandmark = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!mainLandmark) {
    issues.push('main landmark added');
  }

  // Address REACT_041: Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'SVG image';
      svg.insertBefore(title, svg.firstChild);
      issues.push('SVG accessible name added');
    }
  });

  return issues;
}

// Initialize the application with accessibility improvements
function initialize() {
  initializeAccessibility();
  // Other initialization code (if any)
}

// Export functions for testing
export {
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  initApp,
  landmarks,
  appData,
  icons,
  validateLandmark,
  ensureFocusableElements,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  countDependencies,
  createInPageButton,
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  addFixLandmarkIssues,
  fixFakeLinkIssues,
  createAccessibleLink,
  initializeAccessibility,
  initialize,
  replaceFakeLinks
};

// TODO: Any additional changes requested in the issue should be added after this function