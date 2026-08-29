Here is the resolved `main.js` file with Git merge conflict markers removed:

```javascript
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

  // Accessibility: Add skip link functionality, enhanced with flag for keyboard access
  function setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.id = 'main-content-skip-link';
    skipLink.setAttribute('role', 'skip-link');
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
  }

  // Accessibility: Ensure buttons have proper labels, without duplicating existing code for buttons
  function setupButtonAccessibility() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', 'Action button');
      }
    });
  }

  // Accessibility: Implement new function to address new accessibility issues
  function addressAccessibilityIssues() {
    // Assuming we are adding an ARIA role to the dependencyGraph container
    const dependencyGraph = document.querySelector('.dependencyGraph');
    if (dependencyGraph) {
      dependencyGraph.setAttribute('role', 'group');
      // You might want to set other ARIA properties or check for more complex requirements from the insight report
    }

    // To implement further accessibility enhancements, you might want to create new functions for validation and validation structure
    // of tables, landmarks, and SVG accessibility
  }

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

// define new render function for dependency graph
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

function addLangAttribute(rootElement, lang) {
  rootElement.setAttribute('lang', lang);
}

// Functions from conflicted code:
function validateLandmark() {
  // Validate landmark accessibility
  // Return true if valid, false otherwise
  return true;
}

function validateLandmarkStructure(rootElement) {
  // Validate landmark structure
  // Return true if valid, false otherwise
  return rootElement;
}

function getSvgAccessibleName(svgElement) {
  // Get accessible name for SVG
  // Return accessible name
  return 'Decorative graphic';
}

function createInPageButton(buttonId, label, onclick) {
  const button = document.createElement('button');
  button.setAttribute('id', buttonId);
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', label);
  button.setAttribute('onclick', onclick);
  return button;
}

function personName(name) {
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

// New accessibility enhancement: ensure root container has accessible name and create announcement region
const rootContainer = document.getElementById('root').parentElement;
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

function validateTableAccessibility() {
  // ...
}

function validateTableStructure() {
  // ...
}

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
```