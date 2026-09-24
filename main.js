// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/tableAccessibilityUtils';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import accessibility helpers from AccessibilityHelpers module
const main = require('./utilities')
const accessibilityHelpers = require('./AccessibilityHelpers');

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
  if (!dependencyGraph.id) {
    dependencyGraph.id = 'dependencyGraph'
  }

  // Ensure the container is focusable if it's interactive
  if (!dependencyGraph.hasAttribute('tabindex')) {
    dependencyGraph.setAttribute('tabindex', '0')
  }

  accessibilityHelpers.setupFocusTrap('#dependencyGraph')
}

// Add lang attribute to HTML element if missing
accessibilityHelpers.addLangAttribute(document.documentElement)

const {
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  getSvgAccessibleName,
  getLangAttribute: getLangAttributeHelper,
  validateTableStructure,
  validateSession,
  handleCredentialResponse,
  accessibilityUtils,
  createAnnouncer,
  renderDependencyGraph,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  filterValidItems,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  exportUtils,
  addressAccessibilityIssues,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse
} = accessibilityHelpers

function filterValidItems(items, validator) {
  return items.filter((item) => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

module.exports = {
  ...main,
  ...accessibilityHelpers,
  ensureElementId,
  ensureElementIdOrigin,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute: getLangAttributeHelper,
  validateAccessibilityReport,
  validateTableStructure,
  validateSession,
  handleCredentialResponse,
  accessibilityUtils,
  createAnnouncer,
  renderDependencyGraph,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  filterValidItems,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  exportUtils,
  addressAccessibilityIssues,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse
};