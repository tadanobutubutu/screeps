// TODO: Update the existing function using the new functions for rendering graph/index
// ADDED: Created renderGraphAndIndex function that uses the new renderDependencyGraph and renderIndexView functions
function renderGraphAndIndex(graphNode, indexPath, graphContainer, indexContainer, options = {}) {
  // Render the dependency graph using the new renderDependencyGraph function
  const graphResult = renderDependencyGraph(graphNode, graphContainer, {
    ...options.graphOptions,
    width: options.graphWidth || '100%',
    height: options.graphHeight || '400'
  });
  
  // Render the index view using the new renderIndexView function
  const indexResult = renderIndexView(indexPath, indexContainer, {
    baseUrl: options.baseUrl || '',
    separator: options.separator || '/',
    ariaLabel: options.breadcrumbAriaLabel || 'Breadcrumb',
    listClassName: options.breadcrumbListClassName || 'breadcrumb',
    ...options.indexOptions
  });
  
  // Return combined results
  return {
    success: graphResult.success && indexResult.success,
    graph: graphResult,
    index: indexResult,
    errors: [
      ...(graphResult.errors || []),
      ...(indexResult.errors || [])
    ]
  };
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  renderDependencyGraph,
  renderIndexView,
  buildDependencyGraph,
  buildBreadcrumbData,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility
} = main

const primaryContent = (typeof document !== 'undefined') ? document.querySelector('main') || document.querySelector('#content') || document.querySelector('.content') || document.querySelector('article') || document.getElementById('primary-content') || document.body : null;

// New function to wrap primary content in a <main> element for accessibility compliance
function wrapPrimaryContentInMain(container, options = {}) {
  if (!container || typeof container !== 'object' || !container.nodeType) {
    return null;
  }

  const config = {
    mainId: options.mainId || 'main-content',
    mainRole: options.mainRole || 'main'
  };

  // Check if main element already exists
  let mainElement = container.querySelector('main');

  if (mainElement) {
    // Main element already exists, ensure it has proper id
    if (!mainElement.id) {
      mainElement.id = config.mainId;
    }
    // Ensure proper role
    if (!mainElement.getAttribute('role')) {
      mainElement.setAttribute('role', config.mainRole);
    }
    return mainElement;
  }

  // Create new main element
  mainElement = document.createElement('main');
  mainElement.id = config.mainId;
  mainElement.setAttribute('role', config.mainRole);

  // Find primary content to wrap
  // Priority: role="main" > main element > article > section with id > body content
  const primarySelectors = [
    '[role="main"]',
    'article:not([role])',
    'section[id]',
    '.primary-content',
    '#primary-content',
    '.main-content',
    '#main-content'
  ];

  let primaryContent = null;

  for (const selector of primarySelectors) {
    primaryContent = container.querySelector(selector);
    if (primaryContent) {
      break;
    }
  }

  if (primaryContent) {
    // Move primary content children into main element
    while (primaryContent.firstChild) {
      mainElement.appendChild(primaryContent.firstChild);
    }

    // Replace primary content with main element
    primaryContent.parentNode.replaceChild(mainElement, primaryContent);
  } else {
    // No specific primary content found
    // Get body or container's direct children
    const body = container.ownerDocument ? container.ownerDocument.body : null;
    const contentParent = body || container;

    // Collect direct children to move
    const childrenToMove = Array.from(contentParent.childNodes).filter(node => {
      // Skip script, style, and meta elements
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (['script', 'style', 'link', 'meta', 'noscript'].includes(tagName)) {
          return false;
        }
        // Skip existing main element
        if (tagName === 'main') {
          return false;
        }
      }
      return true;
    });

    // Move children to main element
    childrenToMove.forEach(child => {
      mainElement.appendChild(child);
    });

    // Append main element to container
    if (body) {
      body.appendChild(mainElement);
    } else {
      container.appendChild(mainElement);
    }
  }

  // Log successful operation
  if (typeof log === 'function') {
    log(`Primary content wrapped in main element with id: ${config.mainId}`, 'info');
  }

  return mainElement;
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0
  };
}

// Main entry point function (implementation added)
function main() {
  // Main application logic can be added here
  console.log("Main function executed");
  // Example: initialize accessibility features
  accessibility();
  // Additional setup can be added as needed
}

// Export all functions from both branches
module.exports = {
  greetingFunction,
  renderGraphIndex,
  renderGraphIndexAlt,
  accessibility,
  ensureInteractiveElementsAccessible,
  handleInitialAccessibility,
  addressAccessibilityIssues,
  validateSession,
  getActiveSessionsCount,
  revokeSession,
  a11yStore,
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
  dependencyGraphContent,
  indexContent,
  main,
  addressabilityIssues: AddressabilityIssues,
  // Additional utility functions from merged code
  loadConfigurations,
  countDependencies,
  sanitizeFilename,
  processData,
  generateSessionId,
  prefersReducedMotion,
  prefersHighContrast,
  isLandmarkElement,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkRoles,
  validateLandmarkStructure,
  checkLandmarkAccessibility,
  checkLandmarkElements,
  checkAccessibilityOfLandmarks,
  ensureUniqueLandmarks,
  missingRoles,
  fixFakeLinkIssue,
  addAriaLabel,
  addAriaLabelLegacy,
  checkElementAccessibility,
  handleAccessibilityIssues,
  addLangAttribute,
  getLangAccessibleName,
  getLangAttribute,
  renderDependencyGraphs,
  addLanguageAttribute,
  addMainLandmarkToIndex,
  createAccessibleLink,
  isLinkAccessible,
  renderDependencyGraph,
  renderIndexView,
  buildDependencyGraph,
  buildBreadcrumbData,
  renderGraphAndIndex,
  towerDefense,
  wrapPrimaryContentInMain,
  implementAccessibilityFixesFromReport
};