const main = require('./utilities');
const React = require('react');
const { setElementLabel } = require('./AccessibilityHelpers');

// Main entry point for the Screeps bot.
// Handles core game logic and integration points.
const main = require('./utilities')
const React = require('react');

const { addLangAttribute, validateTableAccessibility, validateTableStructure, fixTableStructure, fixLandmarkIssues, addMainLandmark, addLandmarkRegions, ensureUniqueLandmarks, addSvgAccessibleName, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, validateLandmark, validateLandmarkStructure, googleSignIn, decodeJwtResponse, fixButtonIdentifiers, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, setupFocusTrap, restoreFocus } = require('./AccessibilityHelpers')

const DOMParser = require('@xmldom/xmldom').DOMParser;

// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
const { accessibilityUtils } = require('./accessibilityUtils');

// New function: Keyboard event handler for accessibility
function handleKeyboardNavigation(event) {
  const key = event.key;
  const activeElement = document.activeElement;

  // Handle keyboard navigation (e.g., arrow keys, tab)
  switch (key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      this.navigateWithArrow(key, activeElement);
      break;
    case 'Tab':
      this.handleTabNavigation(event, activeElement);
      break;
    default:
      break;
  }
}

// Helper for arrow key navigation
function navigateWithArrow(key, activeElement) {
  // Implement custom navigation logic based on element type
  console.log(`Navigating with ${key} key`);
}

// Helper for tab key navigation
function handleTabNavigation(event, activeElement) {
  // Implement custom tab navigation logic
  console.log('Handling tab navigation');
}

// New function: Implement a focus trap to ensure the focus remains within the application
function focusTrap(initialElementId) {
  const element = document.getElementById(initialElementId);
  if (element) {
    element.focus();
    element.setAttribute('tabindex', '0');

    document.addEventListener('keydown', (event) => {
      const activeElement = document.activeElement;
      if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
      }

      // If the last element is focused and the tab key is pressed, move focus to the first element
      if (activeElement === document.body.lastElementChild && event.key === 'Tab') {
        document.body.firstElementChild.focus();
      }
      // If the first element is focused and the shift + tab key is pressed, move focus to the last element
      else if (activeElement === document.body.firstChild && event.key === 'Shift+Tab') {
        document.body.lastElementChild.focus();
      }

      handleKeyboardNavigation.call(this, event);
    });
  }
}

// Import and use existing functions from utilities
const { renderDependencyGraphs, ...mainUtilities } = main;

// Replace the original export with the updated and extended one
module.exports = {
  addTask,
  setFocus,
  handleKeyboardNavigation,
  navigateWithArrow,
  handleTabNavigation,
  focusTrap,
  renderDependencyGraphs,
  navigateWithArrow,
  handleTabNavigation,
  createInPageButton,
  ...mainUtilities
}