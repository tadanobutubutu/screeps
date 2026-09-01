// Dependency imports
const { dependencyGraphContent } = require('./dependency-graph');
const { indexContent } = require('./index-template');

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Import necessary dependencies
import React from 'react';
import { render } from 'react-dom';
import { addLangAttribute, fixTableStructure, fixLandmarkIssues, addMainLandmark, addLandmarkRegions, ensureUniqueLandmarks, uniqueLandmarks, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, googleSignIn, decodeJwtResponse, fixButtonIdentifiers, ensureElementHasId, addAriaLabel, renderDependencyGraphs } from './AccessibilityHelpers';

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph');

if (dependencyGraph) {
  // Set appropriate ARIA role for the dependency graph container
  // Using 'region' role for a contained section of content
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region');
  }

  // Add accessible label if not already present
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }
}

// TODO: Implement a new function to handle focus trap for keyboard navigation
/**
 * Creates a focus trap for keyboard navigation within a specified container
 * @param {HTMLElement} container - The container element to trap focus within
 * @param {Object} options - Configuration options for the focus trap
 * @param {boolean} options.initialFocus - Whether to set initial focus to the first focusable element
 * @param {boolean} options.returnFocus - Whether to return focus to the previously focused element when trap is released
 * @returns {Object} An object with methods to activate and deactivate the focus trap
 */
function createFocusTrap(container, options = {}) {
  const { initialFocus = true, returnFocus = true } = options;
  let previouslyFocusedElement = null;
  let active = false;

  // Get all focusable elements within the container
  function getFocusableElements() {
    return Array.from(container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  // Handle keyboard events
  function handleKeyDown(event) {
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift+Tab: move focus to last element if at first
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // Tab: move focus to first element if at last
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    } else if (event.key === 'Escape') {
      // Optional: Add escape key to deactivate trap
      deactivate();
    }
  }

  // Activate the focus trap
  function activate() {
    if (active) return;

    previouslyFocusedElement = document.activeElement;
    active = true;

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0 && initialFocus) {
      focusableElements[0].focus();
    }

    container.addEventListener('keydown', handleKeyDown);
    container.setAttribute('data-focus-trap', 'active');
  }

  // Deactivate the focus trap
  function deactivate() {
    if (!active) return;

    active = false;
    container.removeEventListener('keydown', handleKeyDown);
    container.removeAttribute('data-focus-trap');

    if (returnFocus && previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }

  return {
    activate,
    deactivate,
    isActive: () => active
  };
}

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName(svgString) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return new XMLSerializer().serializeToString(svg);
}

// Example usage of the function
const originalSvgString = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const modifiedSvgString = addAccessibleName(originalSvgString);

/**
 * Validates table accessibility
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
function validateTableAccessibility(tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

/**
 * Validates table structure
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table structure is valid, false otherwise
 */
function validateTableStructure(tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

// Other code...

// New utility functions

/**
 * Formats a dependency version string for display
 * @param {string} version - Version string
 * @returns {string} Formatted version
 */
function formatVersion(version) {
  if (!version) return 'latest';
  return version.startsWith('v') ? version : `v${version}`;
}

/**
 * Sanitizes a string for safe HTML rendering
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Export all utility functions
module.exports = {
  renderDependencyGraph,
  renderIndex,
  formatVersion,
  sanitizeHtml,
  validateTableAccessibility,
  validateTableStructure,
  renderAdditionalContent,
  createFocusTrap
};