// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

// Existing code
export function existingFunction1() {
  // Existing implementation
}

export function existingFunction2() {
  // Existing implementation
}

// New Function
export function newFunction() {
  // Implement the new functionality (as per the original commitment)
  // Specific logic required here goes below
  // Example:
  // return 'New functionality result';
}

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
export function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

/**
 * Adds lang attribute to HTML element
 */
export function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }

  const hasHeaders = table.querySelector('th');
  const hasCaption = table.querySelector('caption');
  const hasThead = table.querySelector('thead');
  const hasTbody = table.querySelector('tbody');

  return hasHeaders && hasCaption && hasThead && hasTbody;
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
export function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }

  const rows = table.querySelectorAll('tr');
  for (const row of rows) {
    const cells = row.querySelectorAll('th, td');
    for (const cell of cells) {
      if (cell.tagName === 'TH' && !cell.getAttribute('scope')) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 * @returns {boolean} True if table was fixed
 */
export function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }

  let fixed = false;

  // Add caption if missing
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table';
    table.insertBefore(caption, table.firstChild);
    fixed = true;
  }

  // Ensure thead exists
  if (!table.querySelector('thead')) {
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixed = true;
    }
  }

  // Ensure tbody exists
  if (!table.querySelector('tbody')) {
    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length > 0) {
      const tbody = document.createElement('tbody');
      rows.forEach(row => {
        if (row.parentElement !== table) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
      fixed = true;
    }
  }

  // Add scope to th elements
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(th => {
    if (!th.getAttribute('scope')) {
      const isColumnHeader = th.parentElement && th.parentElement.parentElement?.tagName === 'THEAD';
      if (isColumnHeader) {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
      fixed = true;
    }
  });

  return fixed;
}

/**
 * Adds main landmark to the page
 */
export function addMainLandmark() {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else {
      body.appendChild(main);
    }
  }
}

/**
 * Validates landmark accessibility
 * @returns {boolean} True if landmarks are valid
 */
export function validateLandmark() {
  const landmarks = {
    banner: document.querySelectorAll('header'),
    nav: document.querySelectorAll('nav'),
    main: document.querySelectorAll('main'),
    contentinfo: document.querySelectorAll('footer'),
    aside: document.querySelectorAll('aside'),
    search: document.querySelectorAll('[role="search"]'),
    form: document.querySelectorAll('form')
  };

  return Object.values(landmarks).some(elements => elements.length > 0);
}

/**
 * Validates landmark structure
 * @returns {boolean} True if landmark structure is valid
 */
export function validateLandmarkStructure() {
  const mainLandmark = document.querySelector('main');
  const navLandmarks = document.querySelectorAll('nav');
  const headerLandmarks = document.querySelectorAll('header');
  const footerLandmarks = document.querySelectorAll('footer');

  return mainLandmark !== null && navLandmarks.length <= 2 && headerLandmarks.length <= 1 && footerLandmarks.length <= 1;
}

/**
 * Validates landmark attributes
 */
export function validateLandmarkAttributes() {
  const landmarks = document.querySelectorAll('header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  const issues = [];

  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const id = landmark.getAttribute('id');

    // Check for implicit role matches explicit role
    const implicitRoles = {
      'header': 'banner',
      'nav': 'navigation',
      'main': 'main',
      'footer': 'contentinfo',
      'aside': 'complementary'
    };

    if (implicitRoles[tagName] && role && implicitRoles[tagName] !== role) {
      issues.push(`Element ${tagName} has conflicting role: ${role}`);
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Gets SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
export function getSvgAccessibleName(svg) {
  if (!svg) {
    return '';
  }

  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const element = document.getElementById(ariaLabelledby);
    return element ? element.textContent : '';
  }

  // Check title element
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }

  return '';
}

/**
 * Sets SVG attributes for accessibility
 * @param {SVGElement} svg - The SVG element
 */
export function setSvgAttributes(svg) {
  if (!svg) {
    return;
  }

  const accessibleName = getSvgAccessibleName(svg);

  if (!accessibleName) {
    // Add a default accessible name
    const title = svg.querySelector('title') || document.createElement('title');
    if (!svg.querySelector('title')) {
      title.textContent = 'SVG graphic';
      svg.insertBefore(title, svg.firstChild);
    }
    svg.setAttribute('aria-label', 'SVG graphic');
  }

  // Ensure SVG has role="img" for screen readers
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

/**
 * Ensures unique landmarks on the page
 */
export function ensureUniqueLandmarks() {
  const landmarks = ['header', 'main', 'footer', 'nav', 'aside'];
  const seen = {};

  landmarks.forEach(tag => {
    const elements = document.querySelectorAll(tag);
    elements.forEach((el, index) => {
      if (!seen[tag]) {
        seen[tag] = 0;
      }
      if (index === 0 && !el.id) {
        el.id = `${tag}-${seen[tag]}`;
      }
      seen[tag]++;
    });
  });

  // Ensure only one main landmark
  const mainElements = document.querySelectorAll('main