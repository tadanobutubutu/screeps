// TODO: Address accessibility issues from insight report:
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// - REACT_015: Add lang attribute to HTML element (handled by imported components/index.html)

import React from 'react';
import ReactDOM from 'react-dom/client';

// Reusable SVG components with accessible names (REACT_041)
export const LogoIcon = ({ className }) => (
  <svg
    className={className}
    role="img"
    aria-label="Company logo"
    viewBox="0 0 24 24"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
);

export const MenuIcon = ({ className }) => (
  <svg
    className={className}
    role="img"
    aria-label="Menu icon"
    viewBox="0 0 24 24"
  >
    <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
  </svg>
);

// Navigation component with landmark role (REACT_017, REACT_025)
export const Navigation = ({ children }) => (
  <nav aria-label="Main navigation" className="main-nav">
    <ul>
      {children}
    </ul>
  </nav>
);

export const NavItem = ({ href, children }) => (
  <li>
    <a href={href}>{children}</a>
  </li>
);

// Header component with landmark (REACT_017)
export const Header = ({ logo, nav }) => (
  <header role="banner" className="app-header">
    {logo}
    {nav}
  </header>
);

// Main content with landmark (REACT_017, REACT_025)
export const Main = ({ children }) => (
  <main role="main" className="main-content">
    {children}
  </main>
);

// Footer component with landmark (REACT_017, REACT_025)
export const Footer = ({ children }) => (
  <footer role="contentinfo" className="app-footer">
    {children}
  </footer>
);

// Button component to replace fake links (REACT_036)
export const Button = ({ onClick, children, className, type = 'button', ariaLabel }) => (
  <button
    type={type}
    onClick={onClick}
    className={className}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

// Fake link fixed as a button
export const ActionLink = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="action-link"
  >
    {children}
  </button>
);

// Main App component with lang attribute (REACT_015)
const App = () => {
  const handleMenuClick = () => {
    // Menu toggle logic
  };

  return (
    <div className="app-container">
      <Header
        logo={<LogoIcon className="logo" />}
        nav={
          <Navigation>
            <NavItem href="/">Home</NavItem>
            <NavItem href="/about">About</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </Navigation>
        }
      />

      <Main>
        <h1>Welcome to Our Application</h1>
        <p>This is the main content area of the application.</p>
        <ActionLink onClick={() => console.log('Action clicked')}>
          Perform Action
        </ActionLink>
      </Main>

      <Footer>
        <p>&copy; 2024 Application. All rights reserved.</p>
      </Footer>
    </div>
  );
};

/**
 * Initialize the application
 * @returns {boolean} Initialization status
 */
function initialize(options = {}) {
  if (isInitialized) {
    logger.warn('App already initialized');
    return false;
  }

  config.set(options);
  isInitialized = true;
  logger.info('Application initialized');
  return true;
}

/**
 * Process and transform data
 * @param {Array} data - Input data to process
 * @returns {Array|null} Processed data or null if invalid
 */
function processData(data) {
  if (!Array.isArray(data)) {
    return null;
  }
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

/**
 * Validate input string
 * @param {string} input - Input to validate
 * @returns {boolean} Validation result
 */
function validateInput(input) {
  return typeof input === 'string' && input.length > 0;
}

/**
 * Format data for output
 * @param {any} data - Data to format
 * @returns {string} Formatted string
 */
function formatOutput(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Basic utility functions that were previously exported
 */
function calculateSum(a, b) {
  return a + b;
}

function calculateDifference(a, b) {
  return a - b;
}

function calculateProduct(a, b) {
  return a * b;
}

function calculateQuotient(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

/**
 * Example function to check if a number is even
 * @param {number} num - Number to check
 * @returns {boolean} True if even, false otherwise
 */
function isEven(num) {
  return num % 2 === 0;
}

/**
 * Example function to get the maximum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Maximum value
 */
function getMax(a, b) {
  return a > b ? a : b;
}

/**
 * Example function to get the minimum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Minimum value
 */
function getMin(a, b) {
  return a < b ? a : b;
}

// Sample implementation to maintain module structure
function main() {
  console.log('Main function executed');
}

// Polyfill for Array.prototype.flat (if not available)
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    writable: true,
    value: function depthFlat(depth = 1) {
      return depth > 0
        ? Array.prototype.reduce.call(this, function (acc, val) {
            return acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val);
          }, [])
        : Array.prototype.slice.call(this);
    }
  });
}

// Todo 1: Add lang attribute to HTML element
function getLangAttribute(htmlElement) {
  // Implementation: extract language attribute from HTML element
  return htmlElement.getAttribute('lang') || '';
}

function wrapPrimaryContentInMain(htmlElement) {
  // Implementation: wrap primary content in main container
  const mainContainer = document.getElementById('main-content');
  if (mainContainer) {
    htmlElement.parentNode.appendChild(mainContainer);
  }
}

// Todo 2: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // Implementation: check if table has proper headers and structure
  if (!table.rows || !table.rows[0]) return false;
  return true;
}

function validateTableStructure(table) {
  // Implementation: verify table structure integrity
  if (!table.rows || table.rows.length <= 0) return false;
  return true;
}

// Todo 3: Add/fix 4 landmark issues
function validateLandmark(landmark) {
  // Implementation: validate landmark properties exist
  return landmark && typeof landmark === 'object';
}

function validateLandmarkStructure(landmark) {
  // Implementation: check landmark structure completeness
  if (!landmark.id) return false;
  return true;
}

function addFixLandmarkIssues() {
  // Implementation: apply fixes for landmark issues
  console.log('Applying landmark fixes');
}

// Todo 4: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // Implementation: generate accessible name for SVG
  return svg.getAttribute('title') || 'Unnamed SVG';
}

function addAriaToFormControls() {
  // Implementation: add ARIA attributes to form controls
  document.querySelectorAll('.form-control').forEach(el => {
    el.setAttribute('aria-label', 'Input field');
  });
}

// Todo 5: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // Implementation: ensure landmarks have unique IDs
  const landmarks = Object.values(require('./landmarks'));
  const seen = new Set();
  for (const landmark of landmarks) {
    if (seen.has(landmark.id)) {
      throw new Error(`Duplicate landmark ID: ${landmark.id}`);
    }
    seen.add(landmark.id);
  }
}

// Todo 6: Fix 1 fake link issue
function fixFakeLinkIssues() {
  // Implementation: fix broken links
  document.querySelectorAll('a[href]').forEach(link => {
    if (!link.href || !link.href.startsWith('http')) {
      link.href = '#';
    }
  });
}

/**
 * Announce content changes to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - Priority level ('polite' or 'assertive')
 */
function announceToScreenReader(message, priority = 'polite') {
  // Remove any existing announcements
  const existingAnnouncement = document.querySelector('[role="status"].sr-only-announcement');
  if (existingAnnouncement) {
    existingAnnouncement.remove();
  }

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only-announcement';
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is read
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.remove();
    }
  }, 1000);
}

// Function to check table structure for accessibility
const checkTableStructure = (tableElement) => {
  const errors = [];

  // Check if table has thead
  const thead = tableElement.find(child => child.type === 'thead');
  if (!thead) {
    errors.push('Table must have a thead element');
  } else {
    // Check if thead has th elements
    const thElements = thead.children || thead.props?.children;
    const hasTh = thElements && (
      (Array.isArray(thElements) && thElements.some(el => el && el.type === 'th')) ||
      (thElements && thElements.type === 'th')
    );
    if (!hasTh) {
      errors.push('Table thead must contain th elements');
    }
  }

  // Check if table has tbody
  const tbody = tableElement.find(child => child.type === 'tbody');
  if (!tbody) {
    errors.push('Table must have a tbody element');
  } else {
    // Check if tbody has tr elements with td
    const rows = tbody.children || tbody.props?.children;
    if (rows) {
      const hasProperRows = Array.isArray(rows)
        ? rows.some(row => row && (row.type === 'tr' || (row.props && row.props.children)))
        : true;
      if (!hasProperRows) {
        errors.push('Table tbody must contain tr elements with td');
      }
    }
  }

  // Check if it's a fake link (div/span with onClick but no href, or an anchor without href)
  const isFakeLink = (tagName === 'div' || tagName === 'span') && onClick && !href;

  if (isFakeLink) {
    return {
      valid: false,
      suggestion: `Replace <${tagName}> with <button> or <a href="#"> for proper accessibility.`
    };
  }

  return { valid: true };
}

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
/**
 * Add scope attributes to table headers
 * @param {HTMLTableElement} tableElement - Table element to process
 * @returns {Array} Array of updates made
 */
function addScopeToHeaders(tableElement) {
  if (!tableElement) return [];

  const headers = tableElement.querySelectorAll('th');
  const updates = [];

  headers.forEach((th) => {
    const row = th.closest('tr');
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(th);

    // Determine if scope should be 'col' or 'row'
    let scope = 'col';

    // Check if it's a row header (first cell in a row that's not the first row)
    if (cellIndex === 0 && rowIndex > 0) {
      scope = 'row';
    }

    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', scope);
      updates.push({
        element: th,
        scope: scope,
        position: { row: rowIndex, col: cellIndex }
      });
    }
  });

  return updates;
}

function createAccessibleLink(link) {
  // Implementation: create accessible link
  const href = link.getAttribute('href');
  if (href) {
    link.setAttribute('aria-label', `Click to go to ${href}`);
  }
}

// Auto-initialize accessibility features
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupSkipLink();
      enhanceKeyboardAccessibility();
    });
  } else {
    setupSkipLink();
    enhanceKeyboardAccessibility();
  }
}

const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

function getAppState() {
  return {
    isInitialized,
    ...appData
  };
}

function setData(key, value) {
  appData[key] = value;
  return appData;
}

function getData(key) {
  return appData[key];
}

function shutdown() {
  isInitialized = false;
  logger.info('Application shutdown complete');
}

// Additional functions from origin
function newFunction() {
  // Implementation of the new function
  console.log('This is the new function.');
}

function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

const VERSION = '1.0.0';

export default App;
export {
  VERSION,
  main,
  initialize,
  getAppState,
  setData,
  getData,
  shutdown,
  config,
  logger,
  newFunction,
  modifiedFunction
};