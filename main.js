// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

export function calculateSum(a, b) {
    return a + b;
}

// Below is the existing code (preserving syntax and existing exports)
// ...
import react from 'react';

const HTML = ({ lang }) => <html lang={lang}>/* other children */</html>;

// Sample data and state
const config = {
  appName: 'DependencyGraphViewer',
  version: '1.0.0',
  settings: {
    showGrid: true,
    maxNodes: 100
  }
};

let appState = {
  initialized: false,
  user: null,
  data: null,
  cache: new Map()
};

// Initialize function
function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

// Initialize app function
function initializeApp() {
  initialize();
  console.log('App state initialized');
}

// Process data function
function processData(data) {
  appState.data = data;
  return data;
}

// Fetch user function
function fetchUser(userId) {
  return appState.user;
}

// Clear cache function
function clearCache() {
  appState.cache.clear();
}

// Validate input function
function validateInput(input) {
  if (!input || typeof input !== 'string') {
    return false;
  }
  return true;
}

// Accessibility Functions

function getLangAttribute(element) {
  // Code for getting the language attribute
  if (typeof document !== 'undefined') {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

function addLangAttribute(element, lang) {
  // Code for adding the language attribute to the specified element
  if (element && element.setAttribute) {
    element.setAttribute('lang', lang || 'en');
    return true;
  }
  return false;
}

function validateTableAccessibility(tableElement) {
  // Code for validating table accessibility
  if (!tableElement) return false;
  
  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td');
  
  // Check if table has proper headers
  if (headers.length === 0) {
    return false;
  }
  
  // Check for scope attributes
  let hasProperScope = true;
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      hasProperScope = false;
    }
  });
  
  return hasProperScope;
}

function validateTableStructure(tableElement) {
  // Code for validating table structure
  if (!tableElement) return { valid: false, issues: [] };
  
  const issues = [];
  
  // Check for proper thead and tbody
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  
  if (!thead) {
    issues.push({ type: 'missing-thead', message: 'Table is missing thead element' });
  }
  
  if (!tbody) {
    issues.push({ type: 'missing-tbody', message: 'Table is missing tbody element' });
  }
  
  // Check for proper th elements
  const headers = tableElement.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push({ type: 'missing-headers', message: 'Table is missing header cells' });
  }
  
  return { valid: issues.length === 0, issues };
}

function fixTableStructure(tableElement) {
  // Code for fixing table structure issues
  if (!tableElement) return false;
  
  let fixed = false;
  
  // Add thead if missing
  if (!tableElement.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      const cells = firstRow.querySelectorAll('td');
      cells.forEach(cell => {
        if (cell.tagName === 'TD') {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          th.setAttribute('scope', 'col');
          thead.appendChild(th);
        }
      });
      tableElement.insertBefore(thead, tableElement.firstChild);
      fixed = true;
    }
  }
  
  // Add tbody if missing
  if (!tableElement.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = tableElement.querySelectorAll('tr');
    rows.forEach((row, index) => {
      if (index > 0) {
        tbody.appendChild(row);
      }
    });
    tableElement.appendChild(tbody);
    fixed = true;
  }
  
  return fixed;
}

function addMainLandmark(containerElement) {
  // Code for adding main landmark
  if (!containerElement) return false;
  
  // Check if main landmark already exists
  if (containerElement.querySelector('main, [role="main"]')) {
    return false;
  }
  
  const mainElement = document.createElement('main');
  mainElement.setAttribute('id', 'main-content');
  mainElement.setAttribute('role', 'main');
  
  // Move existing content into main
  const children = Array.from(containerElement.childNodes);
  children.forEach(child => {
    mainElement.appendChild(child);
  });
  
  containerElement.appendChild(mainElement);
  return true;
}

function validateLandmark(containerElement) {
  // Code for validating landmark
  if (!containerElement) return false;
  
  const main = containerElement.querySelector('main, [role="main"]');
  return main !== null;
}

function validateLandmarkStructure(containerElement) {
  // Code for validating landmark structure
  if (!containerElement) return { valid: false, issues: [] };
  
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  
  landmarks.forEach(landmark => {
    const elements = containerElement.querySelectorAll(`${landmark}, [role="${landmark}"]`);
    if (elements.length > 1 && landmark !== 'nav' && landmark !== 'aside') {
      issues.push({
        type: 'duplicate-landmark',
        message: `Multiple ${landmark} landmarks found`,
        count: elements.length
      });
    }
  });
  
  // Check for proper nesting
  const properLandmarks = ['header', 'main', 'footer'];
  properLandmarks.forEach(landmark => {
    const elements = containerElement.querySelectorAll(`${landmark}, [role="${landmark}"]`);
    if (elements.length === 0 && landmark === 'main') {
      issues.push({
        type: 'missing-landmark',
        message: `Missing ${landmark} landmark`
      });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

function validateLandmarkAttributes(containerElement) {
  // Code for validating landmark attributes
  if (!containerElement) return { valid: false, issues: [] };
  
  const issues = [];
  
  // Check nav elements for aria-label or aria-labelledby
  const navElements = containerElement.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      issues.push({
        type: 'missing-landmark-label',
        message: `Navigation at index ${index} is missing accessible name`,
        element: 'nav'
      });
    }
  });
  
  // Check aside elements for aria-label or aria-labelledby
  const asideElements = containerElement.querySelectorAll('aside');
  asideElements.forEach((aside, index) => {
    if (!aside.hasAttribute('aria-label') && !aside.hasAttribute('aria-labelledby')) {
      issues.push({
        type: 'missing-landmark-label',
        message: `Complementary region at index ${index} is missing accessible name`,
        element: 'aside'
      });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

function getSvgAccessibleName(svgElement) {
  // Code for getting accessible name for SVGs
  if (!svgElement) return '';
  
  // Check for aria-label
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  
  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const labelId = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(labelId);
    return labelElement ? labelElement.textContent : '';
  }
  
  // Check for title element inside SVG
  const titleElement = svgElement.querySelector('title');
  return titleElement ? titleElement.textContent : '';
}

function setSvgAttributes(svg, accessibleName) {
  // Code for setting SVG attributes with the accessible name
  if (!svg) return false;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', accessibleName);
  
  return true;
}

function ensureUniqueLandmarks(containerElement) {
  // Code for ensuring unique landmarks
  if (!containerElement) return false;
  
  let modified = false;
  
  // Add