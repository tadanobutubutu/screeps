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
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Add dependency graph button functionality
  const depGraphContainer = document.getElementById('dependency-graph-container');
  if(depGraphContainer) {
    const renderButton = createInPageDepGraphButton(renderDependencyGraph);
    depGraphContainer.appendChild(renderButton);
  }
  return true;
}

/**
 * Implement this function for creating in-page buttons
 */
function createInPageDepGraphButton(renderFunction) {
  const button = createInPageButton('Render Dependency Graph', renderFunction);
  return button;
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

// Define new render function for dependency graph
function renderDependencyGraph() {
  // Add logic to render the dependency graph
  // ...
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
function addressAccessibilityIssues() {
  // TODO: Implement the function for addressing new accessibility issues
  const issues = [];
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: img,
        message: 'Image is missing alt attribute'
      });
    }
  });

  const interactiveElements = document.querySelectorAll('a, input, select, textarea, button');
  interactiveElements.forEach((el) => {
    const hasLabel =
      el.hasAttribute('aria-label') ||
      el.hasAttribute('aria-labelledby') ||
      el.textContent.trim().length > 0 ||
      el.getAttribute('placeholder') !== null;
    if (!hasLabel) {
      issues.push({
        type: 'missing-accessible-name',
        element: el,
        message: 'Interactive element is missing an accessible name'
      });
    }
  });

  const headings = document.querySelectorAll('h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1), 10);
    if (previousLevel > 0 && level - previousLevel > 1) {
      issues.push({
        type: 'heading-skip',
        element: heading,
        message: `Heading level skipped from h${previousLevel} to h${level}`
      });
    }
    previousLevel = level;
  });

  if (document.documentElement.lang !== 'en' && !document.documentElement.hasAttribute('lang')) {
    issues.push({
      type: 'missing-lang',
      element: document.documentElement,
      message: 'HTML root element is missing lang attribute'
    });
  }

  return {
    total: issues.length,
    issues,
    summary: {
      missingAlt: issues.filter((i) => i.type === 'missing-alt').length,
      missingAccessibleName: issues.filter((i) => i.type === 'missing-accessible-name').length,
      headingSkips: issues.filter((i) => i.type === 'heading-skip').length,
      missingLang: issues.filter((i) => i.type === 'missing-lang').length
    }
  };
}

// New accessibility enhancement: ensure root container has accessible name and create announcement region
const rootContainer = document.getElementById('root');
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

// Helper function to create in-page buttons
function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

// Setup skip links for accessibility
function setupSkipLinks() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-9999px';
  skipLink.style.top = '-9999px';
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
    skipLink.style.top = '-9999px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
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