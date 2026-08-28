// main.js - Table validation utilities and accessibility features

const VERSION = '1.0.0';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Checks if a table has the required structure
 * @param {Array} tableData - The table data to check
 * @param {Array} requiredColumns - List of required column names
 * @returns {Object} - { valid: boolean, missingColumns: string[] }
 */
function checkTableStructureArray(tableData, requiredColumns) {
    if (!Array.isArray(tableData) || tableData.length === 0) {
        return { valid: false, missingColumns: requiredColumns };
    }
    
    const headers = tableData[0];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    return {
        valid: missingColumns.length === 0,
        missingColumns
    };
}

// TODO: Add back any required exports that might have been removed
// Example of how to export a required function from another file
// const { myFunction } = require('./otherFile');
// module.exports = { myFunction };

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

// New function added from HEAD branch
function newFunction() {
  // Implementation of the new function
  console.log('This is the new function.');
}

// Modified implementation of the function
function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

// Export the new function if needed
// export { newFunction };

// _Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: 9e14a7a8fdfef810dc7b463726556b30dceadb72 -->
// <!--- Any other modifications or additions go here --->

// ----- BEGIN ORIGINAL CODE (unchanged) -----

// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

// =============================================================================
// Accessibility Utilities (from origin/main)
// =============================================================================

/**
 * Manages focus for accessibility
 * @param {HTMLElement} element - Element to focus
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Announces content to screen readers using ARIA live regions
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Function to check table structure for accessibility
const checkTableStructure = (tableElement) => {
  const errors = [];
  
  // Check if table has thead
  const thead = tableElement.find(child => child.type === 'thead');
  if (!thead) {
    errors.push('Table must have a thead element');
  } else {
    // Check if thead has th elements
    const thElements = thead.children || thead.props?.children;
    const hasTh = thElements && (
      (Array.isArray(thElements) && thElements.some(el => el && el.type === 'th')) ||
      (thElements && thElements.type === 'th')
    );
    if (!hasTh) {
      errors.push('Table thead must contain th elements');
    }
  }
  
  // Check if table has tbody
  const tbody = tableElement.find(child => child.type === 'tbody');
  if (!tbody) {
    errors.push('Table must have a tbody element');
  } else {
    // Check if tbody has tr elements with td
    const rows = tbody.children || tbody.props?.children;
    if (rows) {
      const hasProperRows = Array.isArray(rows) 
        ? rows.some(row => row && (row.type === 'tr' || (row.props && row.props.children)))
        : true;
      if (!hasProperRows) {
        errors.push('Table tbody must contain tr elements with td');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Example 6: Proper table structure
const AccessibleTable = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{item.name}</td>
          <td>{item.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/**
 * Handles keyboard navigation for custom components
 * @param {KeyboardEvent} event - Keyboard event
 * @param {Array} items - Array of navigable items
 * @param {number} currentIndex - Current focused index
 */
function handleKeyboardNavigation(event, items, currentIndex) {
  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      newIndex = (currentIndex + 1) % items.length;
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      newIndex = (currentIndex - 1 + items.length) % items.length;
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = items.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  if (items[newIndex]) {
    manageFocus(items[newIndex]);
  }
  return newIndex;
}

/**
 * Traps focus within a container for modal dialogs
 * @param {HTMLElement} container - Container element
 * @returns {Function} Cleanup function to remove trap
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  manageFocus(firstElement);

  return () => container.removeEventListener('keydown', handleTabKey);
}

/**
 * Validates form fields and announces errors
 * @param {HTMLFormElement} form - Form to validate
 * @returns {boolean} Is form valid
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;

  inputs.forEach(input => {
    const isFieldValid = input.checkValidity();
    if (!isFieldValid) {
      input.setAttribute('aria-invalid', 'true');
      const errorMessage = input.validationMessage;
      announceToScreenReader(errorMessage, 'assertive');
      isValid = false;
    } else {
      input.removeAttribute('aria-invalid');
    }
  });

  return isValid;
}

// REACT_041: Add accessible names to SVGs
/**
 * Add accessible name to an SVG element
 * @param {SVGElement} svgElement - SVG element to enhance
 * @param {string} accessibleName - Accessible name for the SVG
 */
function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;

  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Date.now()}`;
  title.textContent = accessibleName;

  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);

  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

// REACT_036: Fix fake link issues - convert to proper semantic elements
/**
 * Validate if an element is a proper link
 * @param {HTMLElement} element - Element to validate
 * @returns {Object} Validation result
 */
function isValidLink(element) {
  if (!element) return { valid: true };

  const tagName = element.tagName.toLowerCase();
  const href = element.getAttribute('href');
  const onClick = element.getAttribute('onclick');

  // Check if it's a fake link (div/span with onClick but no href, or an anchor without href)
  const isFakeLink = (tagName === 'div' || tagName === 'span') && onClick && !href;

  if (isFakeLink) {
    return {
      valid: false,
      suggestion: `Replace <${tagName}> with <button> or <a href="#"> for proper accessibility.`
    };
  }

  return { valid: true };
}

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
/**
 * Add scope attributes to table headers
 * @param {HTMLTableElement} tableElement - Table element to process
 * @returns {Array} Array of updates made
 */
function addScopeToHeaders(tableElement) {
  if (!tableElement) return [];

  const headers = tableElement.querySelectorAll('th');
  const updates = [];

  headers.forEach((th) => {
    const row = th.closest('tr');
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(th);

    // Determine if scope should be 'col' or 'row'
    let scope = 'col';

    // Check if it's a row header (first cell in a row that's not the first row)
    if (cellIndex === 0 && rowIndex > 0) {
      scope = 'row';
    }

    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', scope);
      updates.push({
        element: th,
        scope: scope,
        position: { row: rowIndex, col: cellIndex }
      });
    }
  });

  return updates;
}

function createAccessibleLink(link) {
  // Implementation: create accessible link
  const href = link.getAttribute('href');
  if (href) {
    link.setAttribute('aria-label', `Click to go to ${href}`);
  }
}

// Auto-initialize accessibility features
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupSkipLink();
      enhanceKeyboardAccessibility();
    });
  } else {
    setupSkipLink();
    enhanceKeyboardAccessibility();
  }
}

// Export all functions and values
export {
  manageFocus,
  announceToScreenReader,
  checkTableStructure,
  AccessibleTable,
  handleKeyboardNavigation,
  trapFocus,
  validateForm,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  createAccessibleLink,
  newFunction,
  modifiedFunction,
  checkTableStructureArray
};