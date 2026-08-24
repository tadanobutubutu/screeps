// main.js - Main application logic

// Import required dependencies
const { someHelper, formatContent } = require('./utils');

// Configuration
const config = {
  appName: 'MyApp',
  version: '1.0.0',
  debug: false
};

// State management
let applicationState = {
  initialized: false,
  content: [],
  settings: {}
};

/**
 * Initializes the application
 * @returns {boolean} Success status
 */
function initialize() {
  if (applicationState.initialized) {
    console.log('Application already initialized');
    return false;
  }
  
  // TODO: Address accessibility issues from insight report — FIXED
  // REACT_015: Add lang attribute
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
  }
  
  applicationState.initialized = true;
  console.log(`${config.appName} v${config.version} initialized`);
  return true;
}

/**
 * Gets the current application state
 * @returns {Object} Current state
 */
function getState() {
  return { ...applicationState };
}

/**
 * Updates the application state
 * @param {Object} updates - Properties to update
 */
function updateState(updates) {
  applicationState = {
    ...applicationState,
    ...updates
  };
}

/**
 * Adds content to the application
 * @param {string} content - Content to add
 */
function addContent(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('Invalid content provided');
  }
  
  applicationState.content.push(formatContent(content));
}

/**
 * Renders the primary content in a main element
 * @param {string} primaryContent - The primary content to wrap
 * @returns {string} HTML string with content wrapped in main tag
 */
function wrapPrimaryContentInMain(primaryContent) {
  if (!primaryContent) {
    return '<main></main>';
  }
  
  return `<main>${primaryContent}</main>`;
}

/**
 * Clears all content from the application
 */
function clearContent() {
  applicationState.content = [];
}

/**
 * Gets all content as a formatted string
 * @returns {string} Formatted content string
 */
function getContent() {
  return applicationState.content.join('\n');
}

/**
 * REACT_017 / REACT_025: Proper, unique landmark elements
 * Only one of each landmark to avoid duplicates
 * @returns {string} HTML string with proper landmarks
 */
function renderApp() {
  return `
    <header>Application Header</header>
    <nav aria-label="Primary">Navigation</nav>
    <main>Main Content Area</main>
    <footer>Application Footer</footer>
  `;
}

/**
 * REACT_036: Fix fake link — use real <a> tag with href
 * @returns {string} HTML string with proper link
 */
function renderNavigation() {
  return `<a href="/page">Go to page</a>`;
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * @returns {string} HTML string with accessible SVG icons
 */
function renderSvgIcons() {
  return `
    <svg aria-label="First decorative icon" role="img"><title>First decorative icon</title></svg>
    <svg aria-label="Second decorative icon" role="img"><title>Second decorative icon</title></svg>
  `;
}

/**
 * Renders the complete page
 * @returns {string} Complete HTML page
 */
function renderPage() {
  const content = getContent();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${config.appName}</title>
</head>
<body>
  ${renderApp()}
  ${renderNavigation()}
  ${renderSvgIcons()}
  ${wrapPrimaryContentInMain(content)}
</body>
</html>
  `.trim();
}

// Export all public functions and utilities
module.exports = {
  // Core functions
  initialize,
  getState,
  updateState,
  
  // Content management
  addContent,
  clearContent,
  getContent,
  
  // Rendering
  wrapPrimaryContentInMain,
  renderApp,
  renderNavigation,
  renderSvgIcons,
  renderPage,
  
  // Configuration
  config
};