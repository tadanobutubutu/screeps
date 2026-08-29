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
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

// TODO: This is the existing code that needs to be preserved

// Assuming the main.js file is a JavaScript file that includes the HTML content of the ... file.

// ... (other code in main.js)

// Before:
// <a id="unrotate" href="#">rotate back</a>

// After:
// Replace the <a> tag with a <button> element
// <button id="unrotate" role="button" aria-label="rotate back" onclick="rotateBack()">rotate back</button>

// ... (other code in main.js)

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
function rotateBack() {
  // Your code to rotate back
}

// ... (other code in main.js)

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

// (This comment remains as-is)
function addressAccessibilityIssues() {
  // TODO: Implement the function for addressing new accessibility issues
  const issues = [];
  const elements = document.querySelectorAll('img');
  elements.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: img,
        message: 'Image is missing alt attribute'
      });
    }
  });

  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach((el) => {
    const hasLabel =
      el.hasAttribute('aria-label') ||
      el.hasAttribute('aria-labelledby') ||
      el.textContent.trim().length > 0 ||
      el.querySelector('[aria-label]') !== null;
    if (!hasLabel) {
      issues.push({
        type: 'missing-accessible-name',   // Fixed typo from typeOf to type
        element: el,
        message: 'Interactive element is missing an accessible name'
      });
    }
  });

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1), 10);
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

// Export the new function
export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure
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
  validateTableStructure
};