// Import necessary dependencies
import React from 'react'
import { render } from 'react-dom'
import {
  addLangAttribute,
  addMainLandmarkToIndex,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  addAccessibleName,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  fixDependencyGraphAria,
  validateSession,
  handleCredentialResponse
} from './AccessibilityHelpers';

const main = require('./utilities');

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph')

if (dependencyGraph) {
  // Set appropriate ARIA role for the dependency graph container
  // Using 'region' role for a contained section of content
  if (!dependencyGraph.hasAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region')
  }

  // Add accessible label if not already present
  if (!dependencyGraph.hasAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization')
  }

  // Ensure element has an ID if not present
  if (!dependencyGraph.hasAttribute('id')) {
    dependencyGraph.id = 'dependencyGraph';
  }

  // Ensure the container is focusable if it's interactive
  if (!dependencyGraph.hasAttribute('tabindex')) {
    dependencyGraph.setAttribute('tabindex', '0')
  }

  // Import specific helper functions from main module
  const {
    createInPageButton: createInPageButtonAlt,
    createWebResourceButton: createWebResourceButtonAlt,
    validateLandmark: validateLandmarkAlt,
    validateLandmarkStructure: validateLandmarkStructureAlt,
    getSvgAccessibleName: getSvgAccessibleNameAlt,
    getLangAttribute: getLangAttributeAlt,
    validateAccessibilityReport: validateAccessibilityReportAlt,
    exportUtils: exportUtilsAlt,
    addressAccessibilityIssues: addressAccessibilityIssuesAlt,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    createInPageButton,
    createWebResourceButton,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    addAccessibleName,
    validateAccessibilityReport,
    exportUtils,
    addressAccessibilityIssues,
    validateSession,
    handleCredentialResponse
  } = main

  // Import React components
  import App from './App'

  // Run the application
  render(<App />, document.getElementById('root'))

  // Other code...

  // Export the functions to be used elsewhere in the application
  export {
    implementAccessibilityFixesFromReport,
    checkAccessibilityForReport,
    createInPageButton,
    createWebResourceButton,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    addAccessibleName,
    validateAccessibilityReport,
    exportUtils,
    addressAccessibilityIssues,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    validateSession,
    handleCredentialResponse
  }

  // Call the functions to address the accessibility issues on initial load
  implementAccessibilityFixesFromReport(document.body)

  // Helper function for logging
  function log(message, level = 'info') {
    console[level](`[main.js] ${message}`);
  }