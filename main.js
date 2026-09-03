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

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

/**
 * Accessibility functions to be implemented here
 */

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

/**
 * Adds lang attribute to HTML element
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  // Check if table has a caption or summary
  const hasCaption = table.querySelector('caption');
  const hasSummary = table.getAttribute('summary') !== null;
  
  return hasCaption || hasSummary;
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  if (!table) return false;
  
  // Check if table has proper thead and tbody
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;
  const rows = table.querySelectorAll('tr');
  const hasTH = table.querySelectorAll('th').length > 0;
  
  return hasThead && hasTbody && rows.length > 0 && hasTH;
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table) return;
  
  // Check if thead exists, if not, create it
  if (!table.querySelector('thead')) {
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const thead = document.createElement('thead');
      thead.appendChild(firstRow.cloneNode(true));
      table.insertBefore(thead, table.firstChild);
      firstRow.remove();
    }
  }
  
  // Check if tbody exists, if not, wrap remaining rows
  if (!table.querySelector('tbody')) {
    const rows = Array.from(table.querySelectorAll('tr'));
    const tbody = document.createElement('tbody');
    rows.forEach(row => tbody.appendChild(row));
    table.appendChild(tbody);
  }
  
  // Ensure first row cells in thead are th elements
  const thead = table.querySelector('thead');
  if (thead) {
    const firstRowCells = thead.querySelectorAll('td');
    firstRowCells.forEach(cell => {
      const th = document.createElement('th');
      th.innerHTML = cell.innerHTML;
      Array.from(cell.attributes).forEach(attr => {
        th.setAttribute(attr.name, attr.value);
      });
      cell.parentNode.replaceChild(th, cell);
    });
  }
}

/**
 * Adds main landmark to the document
 */
function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    // Find the element with id="root" or class="main" and add role="main"
    const rootContainer = document.getElementById('root');
    if (rootContainer) {
      rootContainer.setAttribute('role', 'main');
    }
  }
}

/**
 * Validates landmark
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark is valid
 */
function validateLandmark(landmark) {
  if (!landmark) return false;
  
  // Check if element has a valid landmark role
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  const role = landmark.getAttribute('role');
  
  if (role && !validRoles.includes(role)) {
    return false;
  }
  
  return true;
}

/**
 * Validates landmark structure
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure(landmark) {
  if (!landmark) return false;
  
  // Check if landmark has proper semantic element or role
  const tagName = landmark.tagName.toLowerCase();
  const role = landmark.getAttribute('role');
  
  const semanticLandmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  const hasSemanticLandmark = semanticLandmarks.includes(tagName);
  const hasRole = role !== null;
  
  return hasSemanticLandmark || hasRole;
}

/**
 * Validates landmark attributes
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark attributes are valid
 */
function validateLandmarkAttributes(landmark) {
  if (!landmark) return false;
  
  const role = landmark.getAttribute('role');
  
  // Check for valid landmark roles
  const validRoles = ['banner', 'navigation', 'main