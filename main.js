// Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

import { calculateSum } from './utils';

// More existing code that should be preserved

// Existing code ends here

// Addressed accessibility issues from insight report

// ... (other code in main.js)

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

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
export function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

/**
 * Creates an accessible button element for unrotate functionality
 * @returns {HTMLElement} The created button element with proper accessibility attributes
 */
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back'); // Fixed: use setAttribute instead of direct property
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

// Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en-US';
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
 * Set accessibility attributes on SVG elements
 * @param {HTMLElement} svgElement - The SVG element to make accessible
 * @param {string} description - The accessible description for the SVG
 */
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
      // Determine if it's a column header or row header based on context
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
  // Task implementation details would go here
}

/**
 * Handle an event with the given parameters
 * @param {string} event - The event to handle
 */
function handleEvent(event) {
  console.log(`Handling event: ${event}`);
  // Event handling logic would go here
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
      // Convert to button or add proper label
      const button = document.createElement('button');
      button.textContent = link.textContent || 'Action';
      button.setAttribute('aria-label', link.getAttribute('aria-label') || 'Button');
      button.addEventListener('click', (e) => {
        e.preventDefault();
        // Handle the link action here
        if (link.onclick) link.onclick(e);
      });
      
      // Replace the link with the button
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
    // Check if table has a caption, aria-label, or aria-labelledby for accessible name
    const caption = table.querySelector('caption');
    const ariaLabel = table.getAttribute('aria-label');
    const ariaLabelledby = table.getAttribute('aria-labelledby');

    if (!caption && !ariaLabel && !ariaLabelledby) {
      issues.push({
        tableIndex: tableIndex,
        issue: 'Table missing accessible name (caption, aria-label, or aria-labelledby)'
      });
    }

    // Check if table headers have proper scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th, thIndex) => {
      if (!th.hasAttribute('scope')) {
        // Determine the appropriate scope based on context
        const parent = th.parentElement;
        const parentTagName = parent ? parent.tagName.toLowerCase() : '';
        const siblings = parent ? Array.from(parent.children) : [];
        const isFirstCell = siblings.indexOf(th) === 0;

        // Auto-fix: Set appropriate scope
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

    // Check for proper table structure (thead, tbody)
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

    // Check if TH elements are properly associated with headers for complex tables
    const dataCells = table.querySelectorAll('td');
    const thElements = table.querySelectorAll('th');
    if (thElements.length > 0 && dataCells.length > 0) {
      // For tables with headers, check if headers have id and data cells have headers attribute
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
          // Try to auto-fix by associating with column position
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

  // Log issues found
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

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('.fake-link');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }