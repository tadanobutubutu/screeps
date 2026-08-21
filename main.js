// main.js - Application entry point

// The main game loop that runs every tick
function loop() {
    // Game logic goes here
}

// Another example function added for the asked question
function exampleFunc() {
    // Example logic for the additional function
}

// Configuration settings for the game
const config = {
    // Add your configuration options here
    maxCreeps: 50,
    room: 'W0N0',
};

// Utilities for addressing accessibility issues

/**
 * Ensures all interactive elements have accessible names
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is accessible
 */
function hasAccessibleName(element) {
  if (!element) return false;
  const hasText = element.textContent.trim().length > 0;
  const hasAriaLabel = element.getAttribute('aria-label');
  const hasAriaLabelledby = element.getAttribute('aria-labelledby');
  const hasTitle = element.getAttribute('title');
  return hasText || hasAriaLabel || hasAriaLabelledby || hasTitle;
}

/**
 * Validates that form inputs have associated labels
 * @param {HTMLFormElement} form - The form to validate
 * @returns {Object} - Validation result with accessible inputs
 */
function validateFormAccessibility(form) {
  if (!form) return { valid: false, inputs: [] };
  const inputs = form.querySelectorAll('input, select, textarea');
  const results = Array.from(inputs).map(input => ({
    element: input,
    hasLabel: !!document.querySelector(`label[for="${input.id}"]`) ||
              input.closest('label') ||
              input.getAttribute('aria-label') ||
              input.getAttribute('aria-labelledby'),
    id: input.id || null
  }));
  return {
    valid: results.every(r => r.hasLabel || !r.id),
    inputs: results
  };
}

/**
 * Ensures buttons have accessible names or roles
 * @param {HTMLElement} container - Container to search
 * @returns {HTMLElement[]} - Buttons missing accessible names
 */
function findInaccessibleButtons(container = document) {
  const buttons = container.querySelectorAll('button, [role="button"]');
  return Array.from(buttons).filter(btn => !hasAccessibleName(btn));
}

// Game-specific features (accessibility improvements)

// Add click handler for the unrotate action
let unrotateElement, newButton;
document.addEventListener('DOMContentLoaded', () => {
  unrotateElement = document.querySelector('.unrotate-btn');
  newButton = document.createElement('button');
  newButton.textContent = 'Rotate back';
  newButton.id = 'rotated-back-btn';
  newButton.addEventListener('click', () => {
    // Your unrotate logic here
    // For example: reset rotation, scroll to top, etc.
    console.log('Rotate back clicked');
  });
   setLanguageAttribute();
   unrotateElement.parentNode.replaceChild(newButton, unrotateElement);
});

// Set language attribute to English
function setLanguageAttribute() {
  document.documentElement.lang = 'en';
}

// Export utilities and init function for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    hasAccessibleName,
    validateFormAccessibility,
    findInaccessibleButtons,
    init: () => {}, // Placeholder init; actual startup logic runs on DOMContentLoaded
    exampleFunc: exampleFunc,
    config: config
  };
}

// Export the loop function for the game engine as requested
module.exports = {
    loop: loop
};