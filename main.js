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

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Accessibility: Address new issues (ARIA role for dependencyGraph)
  const dependencyGraph = document.querySelector('.dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'group');
  }

  // Accessibility: Implement new accessibility enhancement (announcement region)
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

  // Accessibility: New function (validate table accessibility)
  const validateTableAccessibility = () => {
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
  };

  // Accessibility: New function (validate table structure)
  const validateTableStructure = () => {
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
  };

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
  const buttons = document.querySelectorAll('button, [role="button"]');
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

// Function to create in-page buttons with appropriate ARIA attributes
function createInPageButton(id, label, onclick) {
  const button = document.createElement('button');
  button.id = id;
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', label);
  button.setAttribute('onclick', onclick);
  return button;
}

// ... (existing code not included due to its irrelevance to conflict resolution)

// Add the necessary new functions (without strict mode)
function fetchData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

function saveData(url, data) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => resolve(data))
    .catch(error => reject(error));
  });
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
  setupSkipLinks,
  fetchData,
  saveData
};