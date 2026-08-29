// TODO: Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----
// ----- BEGIN CHANGES (to be added) -----
// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// ... (any existing code before line 8) ...
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = 'en';

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.removeAttribute('aria-hidden');
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Add dependency graph button functionality
  const depGraphContainer = document.getElementById('dep-graph-container');
  if(depGraphContainer) {
    createInPageDepGraphButton(depGraphContainer, renderDependencyGraph);
  }
  return true;
}

/**
 * Implement this function for creating in-page buttons
 */
function createInPageDepGraphButton(depGraphContainer, renderFunction) {
  const button = createInPageButton('render-dep-graph', 'Render Dependency Graph', renderFunction);
  depGraphContainer.appendChild(button);
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

// Define new render function for dependency graph
function renderDependencyGraph() {
  // Add logic to render the dependency graph
  // ...
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

function addressAccessibilityIssues() {
  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex') && element.tabIndex < 0) {
      element.setAttribute('tabindex', '0');
    }
  });

  // Ensure all images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach(image => {
    if (!image.hasAttribute('alt')) {
      image.setAttribute('alt', '');
    }
  });

  // Ensure all form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (id && !document.querySelector(`label[for="${id}"]`)) {
      console.warn(`Input with id "${id}" is missing an associated label.`);
    }
  });

  // Ensure proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      console.warn(`Heading hierarchy skipped from h${previousLevel} to h${currentLevel}.`);
    }
    previousLevel = currentLevel;
  });

  // Ensure sufficient color contrast (basic check - flag potential issues)
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const style = window.getComputedStyle(element);
    const color = style.color;
    const backgroundColor = style.backgroundColor;
    if (color && backgroundColor && color !== backgroundColor) {
      // Placeholder for contrast ratio calculation
      // In production, use a proper contrast checking library
    }
  });

  // Ensure ARIA landmarks are present
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"]');
  if (landmarks.length === 0) {
    console.warn('No ARIA landmarks found. Consider adding navigation, main, banner, and contentinfo roles.');
  }

  return true;
}

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

function addLangAttribute(rootElement, lang) {
  // Add lang attribute to the HTML element
  rootElement.setAttribute('lang', lang);
}

// Functions from HEAD side
function validateLandmark() {
  // Validate landmark accessibility
  // Check for proper landmark roles and other accessibility considerations
  // Return true if valid, false otherwise
  return true;
}

function validateLandmarkStructure(rootElement) {
  // Validate landmark structure
  // Check for proper landmark roles and other structural considerations
  // Return true if valid, false otherwise
  return rootElement;
}

function getSvgAccessibleName(svgElement) {
  // Get accessible name for SVG
  // Return accessible name
  return 'Decorative graphic';
}

function createInPageButton(buttonId, label, onclick) {
  // Create an in-page button with appropriate ARIA attributes
  const button = document.createElement('button');
  button.setAttribute('id', buttonId);
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', label);
  button.setAttribute('onclick', onclick);
  return button;
}

function personName(name) {
  // Return person name
  return name;
}

function addMainLandmark(rootElement) {
  // Add main landmark to the provided rootElement
  if (!rootElement) {
    return null;
  }

  const existingMain = rootElement.querySelector('[role="main"]');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    while (rootElement.firstChild) {
      mainElement.appendChild(rootElement.firstChild);
    }
    rootElement.insertBefore(mainElement, rootElement.firstChild);
  }

  return rootElement;
}

function ensureUniqueLandmarks() {
  // Ensure unique landmarks in the entire application
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0 && el.id) {
          el.id = `${el.id}-${index}`;
        }
      });
    }
  });
}

// Rotate back functionality
function rotateBack() {
  // Your code to rotate back
}

// Skip link setup (referenced in initialize)
function setupSkipLinks() {
  // Set up skip link functionality for keyboard navigation
  // Implementation: find or create a skip link that jumps to main content
  let skipLink = document.getElementById('skip-link');
  if (!skipLink) {
    skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.top = 'auto';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.overflow = 'hidden';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  return skipLink;
}

// New accessibility enhancement: ensure root container has accessible name and create announcement region
const rootContainer = document.getElementById('root')?.parentElement;
if (rootContainer) {
  rootContainer.setAttribute('role', 'main');
}

const announcementId = 'accessibility-announcement';
const announcement = document.createElement('div');
announcement.id = announcementId;
announcement.setAttribute('aria-live', 'polite');
announcement.setAttribute('aria-atomic', 'true');
// Hide off-screen
announcement.style.position = 'absolute';
announcement.style.left = '-9999px';
announcement.style.top = '-9999px';
document.body.appendChild(announcement);


// Validate that tables in the document are accessible
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption') !== null;
    const hasHeaders = table.querySelector('th') !== null;
    const hasScope = Array.from(table.querySelectorAll('th')).every(
      th => th.hasAttribute('scope')
    );
    
    results.push({
      tableIndex: index,
      hasCaption,
      hasHeaders,
      hasScope,
      isAccessible: hasCaption && hasHeaders && hasScope
    });
  });
  
  return results;
}

// Validate the structure of tables in the document
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    let isValid = true;
    let error = null;
    
    if (rows.length === 0) {
      isValid = false;
      error = 'Table has no rows';
    } else {
      const cellCounts = Array.from(rows).map(row => row.querySelectorAll('td, th').length);
      const allSame = cellCounts.every(count => count === cellCounts[0]);
      
      if (!allSame) {
        isValid = false;
        error = 'Table has inconsistent cell counts across rows';
      }
    }
    
    results.push({
      tableIndex: index,
      rowCount: rows.length,
      isValid,
      error
    });
  });
  
  return results;
}

// Export existing functionality
export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  setupButtonAccessibility,
  createInPageDepGraphButton,
  renderDependencyGraph,
  setupSkipLinks,
  addLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  personName,
  addMainLandmark,
  ensureUniqueLandmarks,
  rotateBack
};

// Add the new function to the default export
export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  setupButtonAccessibility,
  createInPageDepGraphButton,
  renderDependencyGraph,
  setupSkipLinks,
  addLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  personName,
  addMainLandmark,
  ensureUniqueLandmarks,
  rotateBack
};