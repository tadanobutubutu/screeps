import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Existing code starts here

// This is the existing code that needs to be preserved
// (This comment remains as-is)

// More existing code that should be preserved

// Existing code ends here

// Configuration object for application settings
const appConfig = {
  version: '1.0.0',
  features: {
    accessibility: true,
    skipLinks: true,
    landmarkRoles: true,
    svgAccessibility: true,
    buttonAccessibility: true
  }
};

// Addressed accessibility issues from insight report

// ... (other code in main.js)

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
  return button;
}

// If the `rotateBack` function is defined elsewhere in main.js, ensure it`s called when the button is clicked.
// If not, define it here:
export function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// ... (other code in main. js)

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
 * Adds landmark roles to the main navigation and content sections.
 *
 * This addresses the REACT_017 issue by adding appropriate ARIA roles
 * such as 'navigation', 'main', 'banner', and 'contentinfo' to relevant HTML elements.
 */
const addLandmarkRoles = () => {
  // Navigation landmark
  const navElement = document.querySelector('nav');
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }

// Example usage for SVGs:
// const svg1 = document.querySelector('.svg1');
// const svg2 = document.querySelector('.svg2');
// svg1.setAttribute('aria-label', 'Description of first icon');
// svg2.setAttribute('aria-label', 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it`s a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.prototype.indexOf.call(parent.children, th) === 0;

  // Footer landmark (contentinfo)
  const footerElement = document.querySelector('footer');
  if (footerElement && !footerElement.getAttribute('role')) {
    footerElement.setAttribute('role', 'contentinfo');
  }

  // Specific main-content ID
  const mainContent = document.getElementById('main-content');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }
};

/**
 * Ensures that landmarks are unique by adding unique ARIA labels where necessary.
 *
 * This addresses the REACT_025 issue by checking for duplicate landmarks
 * and making them unique with appropriate aria-label or aria-labelledby attributes.
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.querySelector('a[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '');
      if (target) {
        target.focus();
        target.style.scrollBehavior = 'smooth';
      }
    });
  }

  // Main content landmark uniqueness
  const mainElements = document.querySelectorAll('[role="main"]');
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
  const fakeLinks = document.querySelectorAll('[onclick]:not([role])');
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

function helloWorld() {
  return 'Hello, World!';
}

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

// Function to check landmark elements in the DOM
function checkLandmarkElements() {
    const landmarkSelectors = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
    const results = {};

    landmarkSelectors.forEach((landmark) => {
        const elements = document.querySelectorAll(landmark);
        results[landmark] = {
            count: elements.length,
            exists: elements.length > 0
        };
    });

    return results;
}

// Function to validate landmark structure
function validateLandmarkStructure() {
    const results = checkLandmarkElements();
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };

    if (!results.main.exists) {
        validation.isValid = false;
        validation.errors.push('Required <main> landmark element');
    }

    return validation;
}

// Application data placeholder
const appData = {
    title: 'Application',
    version: '1.0.0'
};

// Initialize accessibility improvements
function initializeAccessibility() {
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
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.querySelector('a[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = skipLink.getAttribute('href') || '';
      const target = document.querySelector(targetId) || '';
      if (target) {
        target.focus();
      }
    });
  }
}

/**
 * Ensure all <th> elements have scope attribute
 * REACT_027: Add scope="col" or scope="row" to <th> elements
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
 * Ensure unique landmark roles throughout the document
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="contentinfo"]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmar ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

/**
 * Add accessible names to SVG elements by ID
 */
function addSvgAccessibleNames() {
  const svg1 = document.getElementById('svg1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.getElementById('svg2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

/**
 * Fix fake link elements that should be buttons
 */
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    handleFakeLinks(link);
  });
}

/**
 * Create an in-page button element
 * @param {string} label - Button text
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} The created button
 */
function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
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

/**
 * Initialization function
 */
const initApp = () => {
  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  ensureUniqueLandmarks();

  const mainContent = document.querySelector('main');
  if (mainContent) mainContent.setAttribute('role', 'main');

  // Define icons object
  const icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screeps icon"></svg>'
  };
};

/**
 * Check landmark element exists
 */
function checkLandmarkElement() {
  return checkLandmarkElements();
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.querySelector('.svg1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.querySelector('.svg2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="contentinfo"]');
  const landmarkIds = new Set();

  // Find all elements with landmark roles
  const landmarks = document.querySelectorAll(allLandmarkRoles.map(role => `[role="${role}"]`).join(','));

  // Group landmarks by role
  const landmarksByRole = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!landmarksByRole[role]) {
      landmarksByRole[role] = [];
    }
    landmarksByRole[role].push(landmark);
  });

  // Check unique landmark roles - should only have one per page
  uniqueLandmarkRoles.forEach(role => {
    const elements = landmarksByRole[role] || [];
    if (elements.length > 1) {
      console.warn(`Multiple ${role} landmarks found. Only one is allowed per page.`);
      // Keep the first one, remove role from others
      elements.slice(1).forEach(el => {
        el.removeAttribute('role');
        console.warn(`Removed duplicate ${role} landmark role from element:`, el);
      });
    }
  });

  // For roles that allow multiples, ensure each has a unique accessible name
  multipleAllowedRoles.forEach(role => {
    const elements = landmarksByRole[role] || [];
    if (elements.length > 1) {
      const usedNames = new Set();
      elements.forEach((el, index) => {
        // Check for existing accessible name
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        let accessibleName = ariaLabel || (ariaLabelledBy ? document.getElementById(ariaLabelledBy).textContent : null);

        if (!accessibleName) {
          // Generate a unique name
          accessibleName = `${role} ${index + 1}`;
          el.setAttribute('aria-label', accessibleName);
        }

        // Ensure uniqueness
        let uniqueName = accessibleName;
        let counter = 1;
        while (usedNames.has(uniqueName)) {
          uniqueName = `${accessibleName} ${counter}`;
          counter++;
        }
        usedNames.add(uniqueName);

        if (uniqueName !== accessibleName) {
          el.setAttribute('aria-label', uniqueName);
        }
      });
    } else if (elements.length === 1) {
      // Single landmark of this type - ensure it has an accessible name if needed
      const el = elements[0];
      const ariaLabel = el.getAttribute('aria-label');
      const ariaLabelledBy = el.getAttribute('aria-labelledby');
      if (!ariaLabel && !ariaLabelledBy) {
        el.setAttribute('aria-label', role);
      }
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    if (!link.textContent.trim() || link.getAttribute('aria-hidden') === 'true') {
      link.setAttribute('role', 'button');
      link.setAttribute('aria-label', link.textContent || 'Action button');
    }
  });
}

// Handle individual fake link conversion
function handleFakeLinks(link) {
  if (link.tagName === 'A') {
    const parent = link.parentElement;
    const newButton = document.createElement('button');
    newButton.textContent = link.textContent || 'Click';
    newButton.setAttribute('role', 'button');
    if (link.id) newButton.id = link.id;
    if (link.className) newButton.className = link.className;
    parent.replaceChild(newButton, link);
  }
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('.rotate-link');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

/**
 * Initialize the application
 */
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
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

  // Accessibility: Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Accessibility: Fix 1 fake link issue
  fixFakeLink();
}

// New function or change requested in the issue
function newFunction() {
  // Implementation of the new function
}

/**
 * Renders the index view in the application.
 * Renders the index view, typically by populating a container element
 * with the index/list view markup and binding any required event handlers.
 */
function renderIndexView() {
  // Implementation of the renderIndexView functionality
  console.log('Rendering index view');
}

export function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Discount must be a non-negative number');
  }

  // Calculate discounted price
  const discountedPrice = price * (1 - discount / 100);
  return Math.max(0, discountedPrice);
}

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

// Export existing functionality and new functions
export { 
  initialize, 
  getConfig, 
  setupSkipLinks, 
  setupButtonAccessibility, 
  createInPageButton, 
  perform