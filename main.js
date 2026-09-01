// main.js
// TODO: Create or update the affected functions to be accessible
// The functions below have been created to match the exported names

// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)
const { createWebResourceButton, validateAccessibilityReport } = require('./utilities');

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  maxRetries: 3,
  timeout: 5000
};

// Accessibility utilities and functions
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  // Get language attribute for HTML element
  getLangAttribute: () => {
    return document.documentElement.getAttribute('lang') || 'en';
  },

  // Validate table accessibility
  validateTableAccessibility: (table) => {
    // Check for proper table structure and ARIA attributes
    if (!table.querySelector('thead') || !table.querySelector('tbody')) {
      console.warn('Table missing thead or tbody');
      return false;
    }
    return true;
  },

  // Validate table structure
  validateTableStructure: (table) => {
    // Check for proper table structure
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) {
      console.warn('Table has no rows');
      return false;
    }
    return true;
  },

  // Validate landmark elements
  validateLandmark: () => {
    const landmarks = ['header', 'nav', 'main', 'footer'];
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(landmark);
      if (elements.length > 1) {
        console.warn(`Multiple ${landmark} elements found`);
      }
    });
  },

  // Validate landmark structure
  validateLandmarkStructure: () => {
    const main = document.querySelector('main');
    if (!main) {
      console.warn('Main landmark missing');
      return false;
    }
    return true;
  },

  // Get accessible name for SVG
  getSvgAccessibleName: (svg) => {
    const title = svg.querySelector('title');
    const desc = svg.querySelector('desc');
    if (title) return title.textContent;
    if (desc) return desc.textContent;
    return svg.getAttribute('aria-label') || 'SVG graphic';
  },

  // Create in-page button with proper accessibility attributes
  createInPageButton: (text, href) => {
    const button = document.createElement('a');
    button.textContent = text;
    button.href = href;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    return button;
  },

  // Get person name with proper accessibility attributes
  personName: (name) => {
    const span = document.createElement('span');
    span.textContent = name;
    span.setAttribute('aria-label', name);
    return span;
  },

  // New focus trap implementation
  newFocusTrap: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return {
      destroy: () => {
        element.removeEventListener('keydown', handleKeyDown);
      }
    };
  }
};

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}]: ${message}`);
}

// Module-level function definitions
function affectedFunction() {
  // Function implementation
  return 'affected function result';
}

function updateFunction() {
  // Function implementation
  return 'update function result';
}

function accessibleFunction() {
  // Function implementation
  return 'accessible function result';
}

// Main entry point
function main() {
  // Application initialization
  return 'main function executed';
}

// Export functions to make them accessible
module.exports = {
  affectedFunction,
  updateFunction,
  accessibleFunction,
  main,
  accessibilityUtils,
};

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
  window.affectedFunction = affectedFunction;
  window.updateFunction = updateFunction;
  window.accessibleFunction = accessibleFunction;
  window.main = main;
  window.accessibilityUtils = accessibilityUtils;
}