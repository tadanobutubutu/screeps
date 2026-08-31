// TODO: This is the existing code that needs to be preserve
// (This comment remains as-is)

// Dependency imports
const { dependencyGraphContent } = require('./dependency-graph');
const { indexContent } = require('./index-template');
const main = require('./utilities');
const { requireDir } = require('require-dir');
requireDir(require.resolve('./utilities'));

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Import necessary dependencies
import React from 'react';
import { render } from 'react-dom';
import { addLangAttribute, fixTableStructure, fixLandmarkIssues, addMainLandmark, addLandmarkRegions, ensureUniqueLandmarks, uniqueLandmarks, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, googleSignIn, decodeJwtResponse, fixButtonIdentifiers, ensureElementHasId, addAriaLabel, renderDependencyGraphs } from './AccessibilityHelpers';

// Import all utilities functions for convenience (merged from both branches)
const {
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  getSvgAccessibleName,
  getLangAttribute,
  ensureElementId,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addMainLandmark,
  addLangAttribute,
  fixTableStructureIssues,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  renderDependencyGraphAria,
  addMainLandmarkToIndex,
  // New function to handle focus trap
  newFocusTrap: newMainFocusTrap,
  // New functions to address new accessibility issues from insight report
  newAddressAccessibilityIssues: addressAccessibilityIssues
} = main;

const accessibilityUtils = {
  // ... existing accessibilityUtils implementation
};

const exportUtils = {
  // ... existing exportUtils implementation
};

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

const a11yStore = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  newFocusTrap: newMainFocusTrap,
  addressAccessibilityIssues
};

const appState = {
  sessions: new Map()
};

const handleCredentialResponse = (credentialResponse) => {
  // Process credential response - basic implementation
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }

  // Check for site name in the origin and set it as the username
  const siteName = document.location.hostname;
  const username = siteName.split('.').slice(0, 2).join('.');

  // Handle the credentialResponse
  const authentication = credentialResponse.getBasicProfile();
  if (authentication) {
    const idToken = credentialResponse.getIdToken();

    // Store the session data
    const sessionData = {
      idToken,
      email: authentication.getEmail(),
      username,
      firstName: authentication.getGivenName(),
      lastName: authentication.getFamilyName(),
      imageUrl: authentication.getImageUrl(),
    };

    // Add or update session data in the state
    const existingSession = appState.sessions.get(sessionData.idToken);
    if (existingSession) {
      existingSession.email = sessionData.email;
      existingSession.firstName = sessionData.firstName;
      existingSession.lastName = sessionData.lastName;
      existingSession.imageUrl = sessionData.imageUrl;
    } else {
      appState.sessions.set(sessionData.idToken, sessionData);
    }

    // Announce success to screen readers (guard in case function missing)
    if (accessibilityUtils.announceToScreenReader) {
      accessibilityUtils.announceToScreenReader(`Logged in as ${sessionData.username}`);
    }

    return { status: 'success', data: sessionData };
  }

  return { status: 'error', message: 'User does not have a Google account' };
};

/**
 * Adds an aria-label attribute to an element.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement} The element with the aria-label added
 */
function addAriaLabel(element, label) {
  if (!element) {
    return null;
  }

  if (typeof label !== 'string' || label.trim() === '') {
    return element;
  }

  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Ensures an element has both an id and an aria-label for accessibility.
 * @param {HTMLElement} element - The element to enhance
 * @param {string} idPrefix - The prefix for generating an id if needed
 * @param {string} ariaLabel - The aria-label text
 * @returns {string|null} The id of the element, or null if element is invalid
 */
function ensureElementAccessibility(element, idPrefix, ariaLabel) {
  if (!element) {
    return null;
  }

  const id = ensureElementId(element, idPrefix);
  addAriaLabel(element, ariaLabel);

  return id;
}

/**
 * Renders the graph index view
 * @param {Object} graphData - The graph data to render
 * @returns {string} Rendered graph index HTML
 */
function renderGraphIndex(graphData) {
  // Use the existing renderDependencyGraph function for actual rendering
  return renderDependencyGraph(graphData);
}

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  // Note: dependencyGraphContent should be provided by the utilities module
  return dependencyGraphContent(deps, options);
}

// Accessibility function (merged from both branches)
function setSvgAccessibleProps(svg) {
  addSvgAccessibleNames(svg); // From branch origin/main
  validateLandmarkStructure(svg); // From branch origin/main
  const titleElement = main.getSvgAccessibleName(svg);
  if (titleElement) {
    svg.setAttribute('aria-labelledby', titleElement.id);
  }
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
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

module.exports = {
  // ... existing exports, updated to use new functions (accessibilityUtils, newFocusTrap)
  a11yStore,
  appState,
  handleCredentialResponse,
  ensureElementId,
  addAriaLabel,
  ensureElementAccessibility,
  renderGraphIndex,
  renderDependencyGraph,
  setSvgAccessibleProps,
  ...main,
  // ... additional exports (if any)
  renderDependencyGraphs,
  renderIndex,
  formatVersion,
  sanitizeHtml,
  validateTableAccessibility,
  validateTableStructure,
  renderAdditionalContent
};