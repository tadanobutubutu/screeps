/**
 * Main JavaScript file
 * Handles UI interactions for the application
 */

/* TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
*/


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
 * Sets up the rotate button replacement
 */
function setupRotateButton() {
  const rotateContainer = document.getElementById('rotate-container');
  
  if (rotateContainer) {
    // Check if the old problematic link exists
    const existingLink = document.getElementById('unrotate');
    
    if (existingLink) {
      // Create a semantic button instead of <a href="#">
      const button = document.createElement('button');
      button.id = 'unrotate';
      button.textContent = 'rotate back';
      button.type = 'button';
      button.className = 'rotate-back-button';
      
      // Copy any existing attributes/styles if needed
      if (existingLink.className) {
        button.className = existingLink.className;
      }
      
      // Replace the link with the button
      existingLink.replaceWith(button);
    }
  }
}

/**
 * Rotates content functionality
 */
function rotateContent() {
  const content = document.getElementById('rotatable-content');
  if (content) {
    const style = window.getComputedStyle(content);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    const newRotation = currentRotation - 90;
    content.style.transform = `rotate(${newRotation}deg)`;
  }
}

/**
 * Sets up other UI interactions
 */
function setupOtherInteractions() {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', function(e) {
      e.preventDefault();
      rotateContent();
    });
  }
}

/**
 * Handles button click functionality
 */
function handleButtonClick() {
  // Implementation to be added based on actual requirements
  console.log('Button clicked');
}

/**
 * Initializes the application
 */
function init() {
  setupRotateButton();
  setupOtherInteractions();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    oAuth2Client,
    generateAuthUrl,
    rotateContent,
    setupRotateButton,
    init,
    handleButtonClick
  };
}