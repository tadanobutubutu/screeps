// Existing code starts here

// This is the existing code that needs to be preserved
// (This comment remains as-is)

// More existing code that should be preserved

// Existing code ends here

// TODO: This is the existing code that needs to be preserved
// (This should be preserved)
// Addressed accessibility issues from insight report

const functionB = {
  X: 'valueX',
  Y: 'valueY',
  Z: 'valueZ'
};

// Placeholder for the affected SVGs
const icons = {
  icon: '<svg viewBox="0 0 100 100" aria-label="Screps icon"><title>Screps Dashboard</title><text y=".9em" x="50">Dashboard</text></svg>'
};

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

/**
 * Creates an in-page button element with an optional click handler.
 * @param {string} buttonText - The label text for the button.
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked.
 * @returns {HTMLElement} The created button element.
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

// New function to add lang attribute to HTML element
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (!htmlElement.lang) {
    htmlElement.setAttribute('lang', 'en'); // Default to English if not specified
  }
}

// New function to wrap primary content in main element
function wrapPrimaryContentInMain() {
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
  if (!landmark.name || !landmark.coordinates) {
    console.error('Invalid landmark structure:', landmark);
    return false;
  }
  return true;
}

// New function to add/fix landmark issues
function addFixLandmarkIssues(landmarks) {
  landmarks.forEach(landmark => {
    // Implement logic to add or fix landmark issues here
    // For example, add a `role` attribute to landmarks without one
    if (!landmark.hasAttribute('role')) {
      landmark.setAttribute('role', 'landmark');
    }
  });
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
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

// Testing the checkLandmarkElement function:
//
// To test this function, we could create a test file with the following content:
const test = require('jest');
// const ReactDOM = require('react-dom'); // already defined above
// const { checkLandmarkElement } = require('./main'); // not needed, function is in scope
const landmark = document.createElement('div');
landmark.id = 'test-landmark';
document.body.appendChild(landmark);
test.test('Check landmark element', () => {
  expect(checkLandmarkElement('test-landmark')).toBeTruthy();
});
test.run();

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

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
  button.ariaLabel = 'rotate back';
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.getElementById('unrotate');
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
const isSecureContext = () => {
  return window.isSecureContext;
};

/**
 * Sets the language attribute on the HTML element.
 *
 * This ensures that screen readers and other assistive technologies
 * can correctly interpret the language of the page.
 *
 * @param {string} lang - The language code to set (e.g., 'en', 'es', 'fr').
 */
const setLanguageAttribute = (lang = 'en') => {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
};

/**
 * Adds landmark roles to the main navigation and content sections.
 *
 * This addresses the REACT_017 issue by adding appropriate ARIA roles
 * such as 'navigation', 'main', and 'banner' to relevant HTML elements.
 */
const addLandmarkRoles = () => {
  // Navigation landmark
  const navElement = document.querySelector('nav');
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }

  // Main content landmark
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  // Header landmark (banner)
  const headerElement = document.querySelector('header');
  if (headerElement && !headerElement.getAttribute('role')) {
    headerElement.setAttribute('role', 'banner');
  }
};

/**
 * Ensures that landmarks are unique by adding unique ARIA labels where necessary.
 *
 * This addresses the REACT_025 issue by checking for duplicate landmarks
 * and making them unique with appropriate aria-label or aria-labelledby attributes.
 */
const ensureUniqueLandmarkElements = () => {
  // Navigation landmark uniqueness
  const navElements = document.querySelectorAll('nav');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (index > 0) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }

  // Main content landmark uniqueness
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    mainElements.forEach((main, index) => {
      if (index > 0) {
        main.setAttribute('aria-label', `Main content ${index + 1}`);
      }
    });
  }
};

/**
 * Adds accessible names to SVG elements.
 *
 * This addresses the REACT_041 issue by ensuring that SVGs have appropriate
 * accessible names, either through title or desc elements.
 *
 * @param {string} svgSelector - The CSS selector for the SVG element(s).
 * @param {string} accessibleName - The accessible name to set.
 */
const addSVGAccessibleName = (svgSelector, accessibleName) => {
  const svgs = document.querySelectorAll(svgSelector);
  svgs.forEach((svg) => {
    // Check if the SVG already has a title element
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      svg.insertBefore(titleElement, svg.firstChild);
    }
    titleElement.textContent = accessibleName;
  });
};

/**
 * Fixes fake links (elements that look like links but are not semantic <a> tags).
 *
 * This addresses the REACT_036 issue by identifying elements that have
 * click handlers but are not <a> tags and adding appropriate ARIA roles
 * and attributes to make them accessible.
 */
const fixFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('[role="link"], [onclick]');
  fakeLinks.forEach((element) => {
    if (element.tagName.toLowerCase() !== 'a') {
      // Add role="button" and appropriate ARIA attributes
      element.setAttribute('role', 'button');
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      if (!element.getAttribute('aria-label')) {
        // Use the element's text content as the aria-label if not present
        element.setAttribute('aria-label', element.textContent.trim() || 'Link');
      }
    }
  });
};

function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

function helloWorld() {
  return 'Hello, World!';
}

// Example usage for SVGs:
// const svg1 = document.querySelector('.icon-svg-1');
// const svg2 = document.querySelector('.icon-svg-2');
// addSvgAccessibility(svg1, 'Description of first icon');
// addSvgAccessibility(svg2, 'Description of second icon');

// Function to initialize the dependency graph with accessibility support
function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  return container;
}

// Function to render the dependency graph
function renderDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    // Add the logic to render the dependency graph inside the container
    // This is a placeholder for the actual rendering logic
    container.innerHTML = 'Dependency Graph Data';
  }
}

// Helper function to get element by ID
function getElementById(id) {
    return document.getElementById(id);
}

// Helper function to query elements
function queryElements(selector) {
    return document.querySelectorAll(selector);
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
      const target = document.getElementById(skipLink.getAttribute('href').replace('#', ''));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

const initApp = () => {
  // Initialize the main application
  initializeApp();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  ensureUniqueLandmarkElements();

  // Add accessible names to SVGs (example selectors and names)
  addSVGAccessibleName('.icon-home', 'Home icon');
  addSVGAccessibleName('.icon-settings', 'Settings icon');

  // Fix fake links
  fixFakeLinks();

  // Initialize the application data
  const appData = { title: 'Screps Dashboard', version: '1.0.0' };
  console.log('Initializing ' + appData.title + ' v' + appData.version);

  // Signal that the app has started
  appStarted();
};

// Check if the environment is secure before initializing
if (isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
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
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.getElementById('svg1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.getElementById('svg2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// Function to ensure unique landmarks
function ensurePageUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[aria-landmark]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.getAttribute('aria-labelledby');
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('[href="#"]:not([ aria-hidden ])');
  fakeLinks.forEach((link) => {
    link.removeAttribute('href');
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-hidden') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// Initialize the application with accessibility improvements
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.setAttribute('role', 'main');
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Accessibility: Add landmark roles and fix landmark issues
  addLandmarkRoles();

  // Accessibility: Add accessible names to 2 SVGs
  addSvgAccessibleNames();

  // Accessibility: Ensure unique landmarks
  ensurePageUniqueLandmarks();

  // Accessibility: Fix 1 fake link issue
  fixFakeLink();
}

// New function or change requested in the issue
function newFunction() {
  // Implementation of the new function
}

// Added function to count dependencies
function countDependencies() {
  // Count the number of exported functions in this module
  // We count the named exports that are functions
  // Note: This is a simplified implementation and may not capture all dependencies
  // but serves as a placeholder for the actual dependency counting logic.
  const exports = [
    initialize, getConfig, setupSkipLinks, setupButtonAccessibility,
    checkLandmarkElement, createInPageButton, performTask, handleEvent,
    greet, add, calculateDiscount, newFunction, countDependencies
  ];
  let count = 0;
  exports.forEach(exp => {
    if (typeof exp === 'function') {
      count++;
    }
  });
  return count;
}

// Export existing functionality and new functions
export { 
  initialize, 
  getConfig, 
  setupSkipLinks, 
  setupButtonAccessibility, 
  checkLandmarkElement, 
  createInPageButton, 
  performTask, 
  handleEvent, 
  greet, 
  add, 
  calculateDiscount, 
  newFunction,
  countDependencies 
};

// Compatibility for CommonJS if needed (as per HEAD)
module.exports.newFunction = newFunction;
module.exports.landmarkStructureCheck = landmarkStructureCheck;
module.exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
module.exports.getLangAttribute = getLangAttribute;
module.exports.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
module.exports.validateTableStructure = validateTableStructure;
module.exports.validateTableAccessibility = validateTableAccessibility;
module.exports.validateLandmarkStructure = validateLandmarkStructure;
module.exports.addFixLandmarkIssues = addFixLandmarkIssues;
module.exports.getSvgAccessibleName = getSvgAccessibleName;
module.exports.addAriaToFormControls = addAriaToFormControls;
module.exports.fixFakeLinkIssues = fixFakeLinkIssues;
module.exports.createAccessibleLink = createAccessibleLink;
module.exports.createInPageButton = createInPageButton;
module.exports.rotateBack = rotateBack;
module.exports.checkLandmarkElement = checkLandmarkElement;
module.exports.countDependencies = countDependencies;

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

// More existing code that should be preserved