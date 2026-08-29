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

  // Accessibility: Address new issues by adding ARIA roles and proper labels
  addressAccessibilityIssues();

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
  const button = createInPageButton('Render Dependency Graph', renderFunction);
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
  // Assuming we are addressing accessibility issues by adding ARIA roles to elements

  // Ensure root container has accessible name
  const rootContainer = document.getElementById('root').parentElement;
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Example: Adding `aria-label` attributes to elements
  const myButton = document.querySelector('#myButton');
  myButton.setAttribute('aria-label', 'Load data');

  // Ensure tables in the document are accessible
  const accessibleTableResults = validateTableAccessibility();
  const invalidTableResults = validateTableStructure();

  // Iterate through cases where tables are invalid, and provide a fallback for inaccessible tables.
  invalidTableResults.forEach(({ tableIndex, isValid, error }) => {
    if (!isValid) {
      const table = document.querySelectorAll('table')[tableIndex];
      const tableCaption = document.createElement('caption');
      tableCaption.textContent = error;
      table.appendChild(tableCaption);
    }
  });

  // Create announcement region to provide feedback to assistive technologies about accessible changes
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

  if (accessibleTableResults.every(tableObject => tableObject.isAccessible)) {
    announcement.textContent = `Accessibility improvements have been made to all tables. For more information on these changes, please refer to the accessibility report.`;
  } else {
    // Format issues into string and provide to announcement region
    const issue Strings = accessibleTableResults
      .map((tableObject, index) => {
        let message = '';
        if (!tableObject.hasCaption) {
          message += 'Table ' + (index + 1) + ' is missing a caption.\n';
        }
        if (!tableObject.hasHeaders) {
          message += 'Table ' + (index + 1) + ' is missing headers.\n';
        }
        if (!tableObject.hasScope) {
          message += 'Table ' + (index + 1) + ' headers do not have a scope attribute.\n';
        }
        return message;
      })
      .join('');
    announcement.textContent = `The following accessibility issues were found:\n\n${issueStrings}`;
  }
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
  setupSkipLinks
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
  setupSkipLinks
};