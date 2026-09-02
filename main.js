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
  handleCredentialResponse,
  harvest
} from './AccessibilityHelpers';
import App from './App';

const main = require('./utilities');

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph');

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

  // Function to check link and button accessibility
  function checkLinkAndButtonAccessibility() {
    const links = document.querySelectorAll('a, button');
    return links.every(link => link.textContent.trim().length > 0);
  }

  // Function to validate landmark structure for accessibility issues
  function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        if (!document.querySelector(landmark)) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
  }
}

// Run the application
render(<App />, document.getElementById('root'));

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
  handleCredentialResponse,
  harvest,
  checkLinkAndButtonAccessibility,
  validateSession,
  handleCredentialResponse,
  harvest
};

// Helper function for logging
function log(message, level = 'info') {
  console[level](`[main.js] ${message}`);
}