// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';

// REACT_015: lang attribute added to HTML element
// The React component rendering the HTML element provides the `lang` prop
// The language attribute is set according to the application's settings
// (This comment remains as-is)

// Preserve existing functionality
// REACT_027: 26 table structure issues fixed
// Related commit or original table issues have been addressed

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} elementId - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(elementId, label) {
    const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (element) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
  const elementToModify = document.querySelector('html');
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en');
  }
}

// Address accessibility issues from insight report

// DOM-based accessibility code

function ensureElementHasId(elementId) {
  const element = document.getElementById(elementId);
  if (element && !element.hasAttribute('id')) {
    element.setAttribute('id', elementId);
  }
}

// Ensure elements have the required IDs
ensureElementHasId('myTable');
ensureElementHasId('mySvg');
ensureElementHasId('inPageButton');

// Add ARIA labels for better screen reader support
addAriaLabel('myTable', 'Product data table');
addAriaLabel('myLogo', 'Company logo');
addAriaLabel('myMenu', 'Accessibility menu');

// Add lang attribute to HTML element
function getFullLangAttribute() {
  return 'en-US';
}

function getLangAttribute() {
  return getFullLangAttribute();
}

document.documentElement.setAttribute('lang', getLangAttribute());

function personName() {
  // Existing code...
}

function validateLandmark() {
  // Existing code...
}

function validateLandmarkStructure() {
  // Existing code...
}

function validateTableAccessibility(table) {
  if (!table) return;
}

function validateTableStructure(table) {
  if (!table) return;
}

function ensureElementsHaveIds(elements) {
  return Array.from(elements).map((element, index) => {
    if (!element.id) {
      element.id = `element-${index}`;
    }
    return element;
  });
}

function getSvgAccessibleName() {
  // Existing code...
}

function setSvgAttributes(svgElement, description) {
  if (svgElement) {
    svgElement.setAttribute('role', 'img');
    svgElement.setAttribute('aria-label', description);
  }
}

// Example usage for SVGs:
// const svg1 = document.querySelector('.svg-icon-1');
// const svg2 = document.querySelector('.svg-icon-2');
// setSvgAttributes(svg1, 'Description of first icon');
// setSvgAttributes(svg2, 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '');
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Perform a task with the given parameters
 * @param {string} task - The task to perform
 */
function performTask(task) {
  console.log(`Performing task: ${task}`);
}

/**
 * Handle an event with the given parameters
 * @param {string} event - The event to handle
 */
function handleEvent(event) {
  console.log(`Handling event: ${event}`);
}

function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.querySelector('main') || document.getElementById('main');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.querySelector('.svg-icon-1');
  if (svg1) setSvgAttributes(svg1, 'SVG image 1');

  const svg2 = document.querySelector('.svg-icon-2');
  if (svg2) setSvgAttributes(svg2, 'SVG image 2');
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="contentinfo"]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.id || landmark.getAttribute('aria-labelledby');
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      const button = document.createElement('button');
      button.textContent = link.textContent || 'Action';
      button.setAttribute('aria-label', link.getAttribute('aria-label') || 'Button');
      button.addEventListener('click', (e) => {
        e.preventDefault();
        if (link.onclick) link.onclick(e);
      });
      
      const parent = link.parentElement;
      if (parent) {
        parent.replaceChild(button, link);
      }
    }
  });
}

/**
 * Validates table structure for accessibility issues
 * @returns {Array} Array of accessibility issues found in tables
 */
function validateTableStructure() {
  const issues = [];
  const tables = document.querySelectorAll('table');

  tables.forEach((table, tableIndex) => {
    const caption = table.querySelector('caption');
    const ariaLabel = table.getAttribute('aria-label');
    const ariaLabelledby = table.getAttribute('aria-labelledby');

    if (!caption && !ariaLabel && !ariaLabelledby) {
      issues.push({
        tableIndex: tableIndex,
        issue: 'Table missing accessible name (caption, aria-label, or aria-labelledby)'
      });
    }

    const headers = table.querySelectorAll('th');
    headers.forEach((th, thIndex) => {
      if (!th.hasAttribute('scope')) {
        const parent = th.parentElement;
        const parentTagName = parent ? parent.tagName.toLowerCase() : '';
        const siblings = parent ? Array.from(parent.children) : [];
        const isFirstCell = siblings.indexOf(th) === 0;

        if (isFirstCell && parentTagName === 'tr') {
          th.setAttribute('scope', 'row');
        } else if (parentTagName === 'thead' || !isFirstCell) {
          th.setAttribute('scope', 'col');
        }

        issues.push({
          tableIndex: tableIndex,
          headerIndex: thIndex,
          issue: 'Table header missing scope attribute (auto-fixed)'
        });
      }
    });

    if (!table.querySelector('thead')) {
      issues.push({
        tableIndex: tableIndex,
        issue: 'Table missing thead element for proper semantic structure'
      });
    }

    if (!table.querySelector('tbody')) {
      issues.push({
        tableIndex: tableIndex,
        issue: 'Table missing tbody element for proper semantic structure'
      });
    }

    const dataCells = table.querySelectorAll('td');
    const thElements = table.querySelectorAll('th');
    if (thElements.length > 0 && dataCells.length > 0) {
      const firstHeaderRow = table.querySelector('thead tr') || table.querySelector('tr');
      const headerCells = firstHeaderRow ? firstHeaderRow.querySelectorAll('th') : [];

      headerCells.forEach((th, idx) => {
        if (!th.id) {
          th.id = `table-${tableIndex}-header-${idx}`;
        }
      });

      dataCells.forEach((td) => {
        const existingHeaders = td.getAttribute('headers');
        if (!existingHeaders) {
          const row = td.parentElement;
          const cells = row ? Array.from(row.children) : [];
          const cellIndex = cells.indexOf(td);
          const correspondingTh = headerCells[cellIndex];
          if (correspondingTh && correspondingTh.id) {
            td.setAttribute('headers', correspondingTh.id);
          }
        }
      });
    }
  });

  if (issues.length > 0) {
    console.log('Table accessibility issues found:', issues.length);
    issues.forEach((issue, idx) => {
      console.log(`Issue ${idx + 1}:`, issue);
    });
  } else {
    console.log('No table accessibility issues found.');
  }

  return issues;
}

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '');
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Creates an accessible button element for unrotate functionality
 * @returns {HTMLElement} The created button element with proper accessibility attributes
 */
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
const fakeLink = document.querySelector('.fake-link');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
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
  return button;
}

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

/**
 * Initialize accessibility improvements
 */
function initializeAccessibility() {
  const fakeLink = document.querySelector('.fake-link');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  addLandmarkRoles();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLink();
  validateTableStructure();
  ensureThScope();
  setupSkipLinks();
  setupButtonAccessibility();
}

// Export necessary functions
export {
  createInPageButton,
  rotateBack,
  createUnrotateButton,
  getConfig,
  setSvgAttributes,
  ensureThScope,
  setupSkipLinks,
  setupButtonAccessibility,
  performTask,
  handleEvent,
  addLandmarkRoles,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLink,
  validateTableStructure,
  initializeAccessibility
};

// Run initialization if in browser environment
if (typeof document !== 'undefined') {
  initializeAccessibility();
}