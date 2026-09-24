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

// Accessibility functions
function setFocus(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
    element.setAttribute('tabindex', '0');
  }
}

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
      navigateWithArrow(key, activeElement);
      break;
    case 'Tab':
      handleTabNavigation(event, activeElement);
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

// Accessibility utilities for keyboard navigation and screen reader support
const accessibilityUtils = {
  /**
   * Initialize skip link functionality
   * @param {HTMLElement} skipLink - The skip link element
   */
  initSkipLink(skipLink) {
    if (!skipLink) return;

    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  },

  /**
   * Trap focus within an element
   * @param {HTMLElement} element - The element to trap focus within
   */
  trapFocus(element) {
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const handleKeyboard = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === focusableElements[0]) {
            e.preventDefault();
            if (focusableElements.length > 1) {
              focusableElements[focusableElements.length - 1].focus();
            }
          }
        } else {
          if (document.activeElement === focusableElements[focusableElements.length - 1]) {
            e.preventDefault();
            if (focusableElements[0]) {
              focusableElements[0].focus();
            }
          }
        }
      }
    };

    element.addEventListener('keydown', handleKeyboard);
  }
};

// TODO: Preserve `mathHelpers` dependency for the existing mathematical functions (do not move it into a separate file)
require('./mathHelpers');

module.exports = {
  addTask,
  setFocus,
  handleKeyboardNavigation,
  handleTabNavigation,
  accessibilityUtils,
  // Imported mathematical functions
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
  median
};