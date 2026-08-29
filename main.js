const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  const warnings = [];
  const foundLandmarks = {};

  LANDMARK_ELEMENTS.forEach(landmark => {
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    }
  });

  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * Creates an in-page button for the game interface
 * @param {Object} options - Button configuration options
 * @param {string} options.text - The text to display on the button
 * @param {Function} options.onClick - The callback function when button is clicked
 * @param {string} [options.id] - Optional unique identifier for the button
 * @param {string} [options.title] - Optional title/tooltip for the button
 * @param {string} [options.className] - Optional CSS class name for styling
 * @returns {Object} - The created button object
 */
function createInPageButton(options) {
  const { text, onClick, id, title, className } = options;

  // Validate required options
  if (!text) {
    throw new Error('Button text is required');
  }
  if (typeof onClick !== 'function') {
    throw new Error('onClick callback must be a function');
  }

  // Store button reference (Updated from both branches)
  if (!createInPageButton.buttons) {
    createInPageButton.buttons = {};
  }
  createInPageButton.buttons[button.id] = button;

  // Create button object (Merged code from both branches)
  const button = {
    id: id || `btn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text: String(text),
    title: title || '',
    className: className || 'default-button',
    onClick,
    disabled: false,
    visible: true,
    element: null
  };

  return button;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
  // Existing function implementation
  // New implementation to count dependencies using Document and regex (Removed from both branches)
  // const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`]/g;
  // const document = { body: { textContent: '' } };
  // const importCount = (document.body.textContent || '').match(importCommentRegExp) || [];
  // return importCount.length;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  // ... ( code from both branches merged )
};

// Function to handle dynamic content updates (Added from a branch)
function updateLiveRegion(message, priority = 'polite') {
  if (!a11yStore.liveRegion) return;
  a11yStore.announce(message, priority);
}

// Function to check landmark elements (Added from a branch)
function checkLandmarkElementsInDom() {
  a11yStore.checkLandmarkElements();
}

// Function to add SVG accessibility props (Added from a branch)
function addSVGAccessibilityProps() {
  a11yStore.addSVGAccessibilityProps();
}

function preserveExistingCode() {
  a11yStore.preserveExistingCode();
}

// TODO: Implement this function for creating in-page buttons (Added from a branch)
function createInPageButton(buttonId, buttonText, buttonClass) {
  // ... ( code from added branch )
}

// TODO: Implement this new function for making API calls (Added from a branch)
async function makeAPICall() {
  // Your implementation goes here
}

// Export the new functions if they are needed to be used in other files (CommonJS)
module.exports = {
  // Existing exports
  checkLandmarkElements,
  createInPageButton,
  countDependencies,
  a11yStore,
  addLandmarkRegions,
  addressAccessibilityIssues,
  LANDMARK_ELEMENTS,
  getLangAttribute: a11yStore.getLangAttribute.bind(a11yStore),
  updateLiveRegion,
  addSVGAccessibilityProps,
  preserveExistingCode,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  checkLandmarkElementsInDom,
  makeAPICall
};