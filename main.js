const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// Function to create in-page buttons
const createInPageButton = (options: {
  onClick: () => void;
  label: string;
  icon: string;
  disabled?: boolean;
  isActive?: boolean;
  hoverState: boolean;
  setHoverState: (value: boolean) => void;
  ariaLabel?: string;
  title?: string;
}) => {
  const { onClick, label, icon, disabled = false, isActive = false, hoverState, setHoverState, ariaLabel, title } = options;

  const getBackgroundColor = () => {
    if (disabled) return '#999';
    if (isActive) return '#155d27';
    return '#004b73';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel || label}
      aria-pressed={isActive}
      title={title || label}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      onFocus={() => setHoverState(true)}
      onBlur={() => setHoverState(false)}
      style={{
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease-in-out',
        transform: hoverState ? 'scale(1.05)' : 'scale(1)',
        boxShadow: hoverState ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
        filter: hoverState ? 'brightness(1.1)' : 'none',
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span> {label}</span>
    </button>
  );
};

// Placeholder for the affected SVGs
const icons = {};

function processLandmarks(landmarks) {
  // Ensure all landmarks have valid structure
  const landmarkStructureCheck = (landmark) => {
    // Check landmark properties here
    // ...
    return true; // Add your own check logic
  };

  const validLandmarks = landmarks.filter(landmarkStructureCheck);

  // Ensure the landmarks are unique
  const ensureUniqueLandmarks = (landmarks) => {
    // Add your own unique landmark logic here
    // ...
    return landmarks;
  };

  return ensureUniqueLandmarks(validLandmarks);
}

function getLangAttribute() {
  // Code for getting the language attribute
  const defaultLang = 'en';
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') || defaultLang : defaultLang;
}

function addLangAttribute(htmlElement) {
  if (!htmlElement || !(htmlElement instanceof HTMLElement)) {
    console.error('addLangAttribute: Invalid HTML element provided');
    return;
  }

  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute()); // Use getLangAttribute for consistency
  }
}

// Function to check if the specified landmark element is in the document.
// @param {string} id - The ID of the landmark element.
// @returns {boolean} Returns true if the element exists; otherwise, false.
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

/**
 * Calculates the sum of an array of numbers.
 * @param {number[]} numbers - The array of numbers to sum.
 * @returns {number} The total sum of the numbers.
 */
function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

function personName(person) {
  // Code for getting person's accessible name
  if (!person) return '';
  return person.name || person.displayName || `Person ${person.id}` || 'Unknown Person';
}

function processData(data) {
  if (!data) {
    throw new Error('No data provided');
  }
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

function fetchUser(userId) {
  // Fetch user implementation
  const cachedUser = appState.cache.get(userId);
  if (cachedUser) {
    return cachedUser;
  }
  
  const user = {
    id: userId,
    name: `User ${userId}`,
    createdAt: new Date().toISOString()
  };
  
  appState.cache.set(userId, user);
  appState.users.push(user);
  return user;
}

function clearCache() {
  // Clear the cache implementation
  appState.cache.clear();
  console.log('Cache cleared');
}

function initialize() {
  console.log('Application initialized');
  return true;
}

function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0;
}

function validateTableAccessibility(table) {
  // Code for validating table accessibility
  const issues = [];
  
  if (!table) {
    issues.push({ rule: 'REACT_027', message: 'Table element is missing' });
    return issues;
  }
  
  // Check for proper table structure
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  
  if (!hasHeaders) {
    issues.push({ rule: 'REACT_027', message: 'Table should have header cells (th)' });
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({ rule: 'REACT_027', message: 'Table should have a caption for context' });
  }
  
  // Check for scope attribute on headers
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      issues.push({ rule: 'REACT_027', message: 'Header cell should have a scope attribute' });
    }
  });
  
  return issues;
}

function validateTableStructure(table) {
  // Code for validating table structure
  const structureIssues = [];
  
  if (!table) {
    structureIssues.push({ rule: 'REACT_027', message: 'Table structure validation: table is missing' });
    return structureIssues;
  }
  
  // Check proper nesting of table elements
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  if (!tbody) {
    structureIssues.push({ rule: 'REACT_027', message: 'Table should have a tbody element' });
  }
  
  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      structureIssues.push({ rule: 'REACT_027', message: `Row ${index} has no cells` });
    }
  });
  
  return structureIssues;
}

function fixTableStructure(table) {
  // Code for fixing table structure issues
  if (!table) return false;
  
  // Ensure tbody exists
  if (!table.querySelector('tbody')) {
    const rows = Array.from(table.querySelectorAll('tr'));
    const tbody = document.createElement('tbody');
    rows.forEach(row => tbody.appendChild(row));
    table.appendChild(tbody);
  }
  
  // Add scope to headers if missing
  const headers = table.querySelectorAll('th:not([scope])');
  headers.forEach(th => {
    const row = th.closest('tr');
    const isRowHeader = row && row.querySelector('th') === th;
    th.setAttribute('scope', isRowHeader ? 'row' : 'col');
  });
  
  return true;
}

function addMainLandmark() {
  // Code for adding main landmark
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('role', 'main');
    return main;
  }
  return existingMain;
}

function validateLandmark(element) {
  // Code for validating landmark
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'form'];
  
  if (!element) {
    issues.push({ rule: 'REACT_017', message: 'Element is missing for landmark validation' });
    return issues;
  }
  
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Check if element has valid landmark role or is a landmark element
  if (role && !validLandmarks.includes(role)) {
    issues.push({ rule: 'REACT_017', message: `Invalid landmark role: ${role}` });
  }
  
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.id;
  
  if (role && !hasLabel && ['nav', 'aside', 'section', 'form'].includes(role)) {
    issues.push({ rule: 'REACT_017', message: `Landmark ${role} should have an accessible name` });
  }
  
  return issues;
}

function validateLandmarkStructure() {
  // Code for validating landmark structure
  const structureIssues = [];
  
  // Check for unique main landmark
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    structureIssues.push({ rule: 'REACT_025', message: 'Page should have only one main landmark' });
  }
  
  // Check for header and footer structure
  const headers = document.querySelectorAll('header');
  const footers = document.querySelectorAll('footer');
  
  if (headers.length > 1) {
    structureIssues.push({ rule: 'REACT_025', message: 'Consider having only one header or using role="banner"' );
  }
  
  if (footers.length > 1) {
    structureIssues.push({ rule: 'REACT_025', message: 'Consider having only one footer or using role="contentinfo"' );
  }
  
  // Check landmark nesting
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="complementary"]');
  landmarks.forEach(landmark => {
    const parent = landmark.parentElement;
    if (parent && (
      parent.getAttribute('role') === 'navigation' ||
      parent.getAttribute('role') === 'complementary'
    )) {
      structureIssues.push({ rule: 'REACT_017', message: 'Landmark should not be nested inside another landmark of different type' });
    }
  });
  
  return structureIssues;
}

function validateLandmarkAttributes(element) {
  // Code for validating landmark attributes
  const attributeIssues = [];
  
  if (!element) {
    attributeIssues.push({ rule: 'REACT_017', message: 'Element is missing for attribute validation' });
    return attributeIssues;
  }
  
  const role = element.getAttribute('role');
  
  // Check for appropriate ARIA attributes based on role
  if (role === 'navigation') {
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledby) {
      attributeIssues.push({ rule: 'REACT_017', message: 'Navigation should have aria-label or aria-labelledby' });
    }
  }
  
  if (role === 'complementary') {
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledby) {
      attributeIssues.push({ rule: 'REACT_017', message: 'Complementary region should have aria-label or aria-labelledby' });
    }
  }
  
  return attributeIssues;
}

function getSvgAccessibleName(svg) {
  // Code for getting accessible name for SVGs
  if (!svg) return '';
  
  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  return '';
}

function setSvgAttributes(svg, accessibleName) {
  // Code for setting SVG attributes with the accessible name
  if (!svg) return false;
  
  if (accessibleName) {
    // Set aria-label if no existing accessible name
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', accessibleName);
    }
    
    // Add title element if missing
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = accessibleName;
      title.id = `svg-title-${svg.id || Math.random().toString(36).substr(2, 9)}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  }
  
  // Ensure role is set
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  return true;
}

function addSvgAccessibleNames() {
  // Code for adding accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      setSvgAttributes(svg, accessibleName);
    }
  });
}

module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum
};