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

// New function to extract accessible name from SVG content
function getSvgAccessibleName(svgString) {
  // Extracts the accessible name from SVG content by looking for:
  // 1. aria-label attribute
  // 2. aria-labelledby attribute and referenced element
  // 3. <title> element
  // 4. <desc> element
  // 5. text content if no other accessible name is found

  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;

  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check for aria-labelledby
  const labelledById = svgElement.getAttribute('aria-labelledby');
  if (labelledById) {
    const labelledElement = svg.getElementById(labelledById);
    if (labelledElement) return labelledElement.textContent.trim();
  }

  // Check for <title> element
  const titleElement = svg.querySelector('title');
  if (titleElement) return titleElement.textContent.trim();

  // Check for <desc> element
  const descElement = svg.querySelector('desc');
  if (descElement) return descElement.textContent.trim();

  // Fallback to text content if no accessible name found
  return svgElement.textContent.trim() || 'SVG graphic';
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
// New function to handle accessibility issues
function handleAccessibilityIssues() {
  // Code to handle accessibility issues as per the insight report
  getLangAttribute();
  getFullLangAttribute();
  validateTableAccessibility();
  validateTableStructure();
  validateLandmark();
  validateLandmarkStructure();
  ensureUniqueLandmarks();
  getSvgAccessibleName();
  createInPageButton();
  createAccessibleLink();
  handleAccessibilityIssues();
}

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
  handleAccessibilityIssues,
  formatVersion,
  sanitizeHtml,
  validateTableAccessibility,
  validateTableStructure,
  renderAdditionalContent
};