// main.js - Main application entry point

// Dependency imports
const dependencyGraphContent = require('./dependencyGraphContent').dependencyGraphContent;
const indexContent = require('./indexContent').indexContent;
const http = require('http');
const url = require('url');
const a11yStore = require('./utilities/a11yStore');

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
} = require('./mathHelpers');

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return lang;
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];

  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }

  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }

  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? Array.from(thead.querySelectorAll('th')) : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }

  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });

  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('aria-describedby') || tableElement.getAttribute('summary');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }

  return { valid: errors.length === 0, errors };
}

function renderDependencyGraphs(graphData) {
  if (typeof document === 'undefined') return;

  // Remove any existing graph containers
  const existingContainers = document.querySelectorAll('.dependency-graph-container');
  existingContainers.forEach(container => container.remove());

  // Create new container
  const container = document.createElement('div');
  container.className = 'dependency-graph-container';
  container.setAttribute('role', 'region');

  // Render the graph
  const graphHtml = renderDependencyGraph(graphData);
  container.innerHTML = graphHtml;

  // Add to document
  const mainElement = document.querySelector('main') || document.body;
  mainElement.appendChild(container);
}

// New functions (merged changes from both versions)
function ensureInteractiveElementsAccessible() {
  a11yStore.ensureInteractiveRoles();
  a11yStore.addFormControlLabels();
  a11yStore.ensureImageAccessibility();
}

// Function to handle initial accessibility setup (merged changes from both versions)
function handleInitialAccessibility() {
  a11yStore.checkLandmarkElements();
  a11yStore.addSVGAccessibilityProps();
  a11yStore.fixFakeLinks();
}

// New entry point for accessibility-related functions
function accessibility() {
  // Handle initial accessibility setup on page load
  handleInitialAccessibility();
  // Ensure all interactive elements have proper ARIA roles and attributes after page load
  addressAccessibilityIssues();
}

/**
 * Address accessibility issues for the document
 */
function addressAccessibilityIssues() {
    if (typeof document === 'undefined') {
        return;
    }

    // Check and fix landmark elements
    if (typeof checkLandmarkElements === 'function') {
        checkLandmarkElements();
    }

    // Add SVG accessibility props
    a11yStore.addSVGAccessibilityProps();

    // Fix fake links
    a11yStore.fixFakeLinks();

    // Ensure interactive elements have proper roles
    a11yStore.ensureInteractiveRoles();

    // Add form control labels
    a11yStore.addFormControlLabels();

    // Ensure images have alt text
    a11yStore.ensureImageAccessibility();
}

// New helper function for session management
function validateSession(sessionId) {
    if (!sessionId || typeof sessionId !== 'string') {
        return null;
    }
    const session = appState.sessions.get(sessionId);
    return session || null;
}

/**
 * Get the count of active sessions
 * @returns {number} - Number of active sessions
 */
function getActiveSessionsCount() {
    return appState.sessions.size;
}

/**
 * Revoke a session
 * @param {string} sessionId - The session ID to revoke
 * @returns {boolean} - True if session was revoked
 */
function revokeSession(sessionId) {
    return appState.sessions.delete(sessionId);
}

module.exports = {
  greetingFunction,
  renderGraphIndex,
  accessibility,
  ensureInteractiveElementsAccessible,
  handleInitialAccessibility,
  addressAccessibilityIssues,
  validateSession,
  getActiveSessionsCount,
  revokeSession,
  a11yStore,
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
  dependencyGraphContent,
  indexContent,
  main,
};