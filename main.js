import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Your existing code...

// Existing code ends here

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

/**
 * Checks if a specified landmark element is present in the document.
 * @param {string} id - The ID of the landmark element to check for.
 * @returns {boolean} True if the landmark element exists, false otherwise.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    return false;
  }

  // Validate that the landmark has required properties
  if (element.getAttribute('name') && element.getAttribute('coordinates')) {
    return true;
  }

  return false;
}

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

// New function to add lang attribute to HTML element
function getLangAttribute() {
  if (typeof document === 'undefined') return;
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', 'en'); // Default to English if not specified
  }
}

// New function to wrap primary content in main element
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return;
  const primaryContent = document.querySelector('#primary-content');
  if (primaryContent) {
    const mainElement = document.createElement('main');
    mainElement.id = 'main';
    mainElement.appendChild(primaryContent);
    document.body.insertBefore(mainElement, document.body.firstChild);
  }
}

// New function to validate table structure
function validateTableStructure() {
  if (typeof document === 'undefined') return;
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Implement table structure validation logic here
    // For example, check for the presence of a `<thead>` and `<tbody>`
    if (!table.querySelector('thead') || !table.querySelector('tbody')) {
      console.error('Table structure issue detected:', table);
    }
  });
}

// New function to validate table accessibility
function validateTableAccessibility() {
  if (typeof document === 'undefined') return;
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Implement table accessibility validation logic here
    // For example, check for the presence of `<th>` elements with scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        console.error('Table header without scope attribute detected:', header);
      }
    });
  });
}

// New function to validate landmark structure
function validateLandmarkStructure(landmark) {
  // Implement your logic for checking the landmark structure
  // For example, let's check if the landmark has required properties: name and coordinates
  if (!landmark || !landmark.name || !landmark.coordinates) {
    console.error('Invalid landmark structure:', landmark);
    return false;
  }
  return true;
}

// New function to add/fix landmark issues
function addFixLandmarkIssues(landmarks) {
  if (!landmarks || typeof landmarks[Symbol.iterator] !== 'function') return;
  landmarks.forEach(landmark => {
    // Implement logic to add or fix landmark issues here
    // For example, add a `role` attribute to landmarks without one
    if (landmark && typeof landmark.hasAttribute === 'function' && !landmark.hasAttribute('role')) {
      landmark.setAttribute('role', 'landmark');
    }
  });
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!landmarks || typeof landmarks[Symbol.iterator] !== 'function') return [];
  const uniqueLandmarks = [];
  const seen = new Set();

  for (const landmark of landmarks) {
    // Use id if available, otherwise fall back to name
    const key = landmark.id || landmark.name;

    if (key && !seen.has(key)) {
      seen.add(key);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

// New function to add accessible names to SVGs
function getSvgAccessibleName(svg) {
  // Implement logic to get or set accessible name for SVG
  // For example, check if there's an `aria-label` attribute and return its value
  return svg.getAttribute('aria-label') || svg.textContent;
}

// New function to add ARIA attributes to form controls
function addAriaToFormControls() {
  if (typeof document === 'undefined') return;
  const formControls = document.querySelectorAll('input, select, textarea');
  formControls.forEach(control => {
    // Implement logic to add ARIA attributes to form controls
    // For example, add `aria-labelledby` if there's a label associated with the control
    const labelId = control.getAttribute('for');
    if (labelId) {
      control.setAttribute('aria-labelledby', labelId);
    }
  });
}

// New function to fix fake link issues
function fixFakeLinkIssues() {
  if (typeof document === 'undefined') return;
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    // Implement logic to fix fake link issues
    // For example, add `role="button"` to links that should be interactive but are not
    if (!link.hasAttribute('role') || link.getAttribute('role') !== 'button') {
      link.setAttribute('role', 'button');
    }
  });
}

// New function to create accessible links
function createAccessibleLink(link) {
  // Implement logic to create accessible links
  // For example, add `aria-label` to links that do not have one
  if (!link.hasAttribute('aria-label')) {
    link.setAttribute('aria-label', 'Link to ' + link.textContent);
  }
}

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

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  if (typeof document === 'undefined') return;
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
  if (typeof document === 'undefined') return;
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}

// Ensure the root container has an accessible name
function addressAccessibilityIssues() {
  const rootContainer = document.getElementById('root').parentElement;
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.querySelector('[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Ensure all buttons with role="button" respond to Enter key
  document.querySelectorAll('[role="button"]').forEach(function(button) {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focusVisible polyfill behavior
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  a11y.trapFocus(document.getElementById('modal'));
  a11y.announce('Welcome to the bot!', 'assertive');

  // Adding an alt attribute to an image
  const imageElement = document.getElementById('example-image');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  // Correcting the ARIA role for a div
  const divElement = document.getElementById('example-div');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  // Adding the lang attribute to the HTML element
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  if (typeof document === 'undefined') return;
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
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
  if (typeof document === 'undefined') return;
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  const svg1 = document.getElementById('svg1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.getElementById('svg2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// Function to ensure unique landmarks
function ensurePageUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  const landmarks = document.querySelectorAll('[aria-landmark]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.getAttribute('aria-labelledby');
    if (id) {
      if (landmarkIds.has(id)) {
        console.error('Duplicate landmark ID encountered:', id);
      } else {
        landmarkIds.add(id);
      }
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  if (typeof document === 'undefined') return;
  const fakeLinks = document.querySelectorAll('[href="#"]:not([aria-hidden])');
  fakeLinks.forEach((link) => {
    link.removeAttribute('href');
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  if (typeof document === 'undefined') return;

  // Replace fake links with proper buttons
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }
}

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

// Alias for landmark structure check (referenced in module.exports below)
function landmarkStructureCheck(landmark) {
  return validateLandmarkStructure(landmark);
}

// Export existing functionality and new functions
export { 
  getConfig, 
  setupSkipLinks, 
  setupButtonAccessibility, 
  checkLandmarkElement, 
  createInPageButton, 
  performTask, 
  handleEvent, 
  greet, 
  add,
  addressAccessibilityIssues,
  a11y,
  getLangAttribute,
  rotateBack,
  createUnrotateButton,
  ensureThScope,
  addLandmarkRoles,
  addSvgAccessibleNames,
  ensurePageUniqueLandmarks,
  fixFakeLink,
  initializeAccessibility
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

addressAccessibilityIssues();
createInPageButton();
reportWebVitals();