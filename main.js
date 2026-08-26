// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

const path = require('path');

// Basic path setup
const baseDir = path.join(__dirname, '..');
const srcDir = path.join(baseDir, 'src');

// Export management
module.exports = {
  baseDir,
  srcDir,

  // Accessibility helper functions
  announceToScreenReader: function(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  // Focus management for accessibility
  manageFocus: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.setAttribute('tabindex', '-1');
      element.focus();
    }
  },

  // Keyboard navigation helpers
  handleKeyboardNav: function(event, callback) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  },

  // Make a given element accessible based on the insight report
  makeElementAccessible: function(element) {
    if (!element) return;
    // Ensure the element is focusable
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    // Add appropriate ARIA role if missing
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'button');
    }
    // Add accessible label if missing
    if (!element.hasAttribute('aria-label') && element.textContent) {
      element.setAttribute('aria-label', element.textContent.trim());
    }
  }
};

// Main initialization
function initialize() {
  console.log('Initializing application with accessibility support');
  module.exports.announceToScreenReader('Application loaded');
}

if (require.main === module) {
  initialize();
}

module.exports.initialize = initialize;