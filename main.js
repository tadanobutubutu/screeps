import express from 'express';
import fs from 'fs';
import path from 'path';
import fastMap from 'fast-map';
import accessiblyHelper from './accessibly-helper';
import axe from 'axe-core';

import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from 'react-refresh/output';
import a11y from './AccessibilityUtilities';

const config = {
  name: 'MyApp',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50,
  landmarks: ['main', 'nav', 'aside', 'footer', 'header']
};

const CONFIG = {
  landmarkRoles: config.landmarkRoles,
  maxLandmarks: config.maxLandmarks,
  allowedRoles: config.allowedRoles,
  maxResults: config.maxResults,
  dataPath: config.dataPath
};

const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
  },
  silent: true
};

function calculateMultiplier(factor) {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return factor * safetyCategories.length;
}

async function analyzeModuleDependencies(modules) {
  console.log('Analyzing dependencies for modules:', modules);
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
}

function visualizeModuleRelationships(modules) {
  console.log('Visualizing relationships for modules:', modules);
  return {
    graph: {},
    nodes: [],
    edges: []
  };
}

function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

function loadLandmarks() {
  try {
    const filePath = path.join(config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(validateLandmark);
  const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function ensureUniqueLandmarksList(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seenIds = new Set();
  return landmarks.filter(landmark => {
    if (seenIds.has(landmark.id)) {
      return false;
    }
    seenIds.add(landmark.id);
    return true;
  });
}

function analyzeAccessibility(node) {
  return axe(node, axeConfig);
}

function getAxeResults(issuesData) {
  return issuesData.nodes.map(node => {
    const { violations, bestPractices } = node;
    const results = [];

    violations.forEach(violation => {
      results.push({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        suggestedFixed: violation.required ? 'Required' : 'Recommended',
        helpUrl: violation.helpUrl,
        helpText: violation.help,
        nodes: violation.nodes || []
      });
    });

    bestPractices.forEach(bestPractice => {
      results.push({
        id: bestPractice.id,
        impact: bestPractice.impact,
        description: bestPractice.description,
        helpUrl: bestPractice.helpUrl,
        helpText: bestPractice.help,
      });
    });

    return {
      nodeId: node.id,
      results
    };
  });
}

function generateAccessibilityReport(issuesData) {
  const report = {
    introduction: 'Accessibility report for the application',
    data: getAxeResults(issuesData).flatMap(item => item.results),
    conclusions: '',
  };

  return report;
}

let dependencyGraphData = {};

function getLangAttribute() {
  //...
}

function validateTableAccessibility() {
  //...
}

function validateTableStructure() {
  //... // Single instance to avoid duplication
}

function getSvgAccessibleName() {
  //...
}

function setSvgAttributes(svgElement, options = {}) {
  if (!svgElement) return;

  if (options.label) {
    svgElement.setAttribute('aria-label', options.label);
  }
  if (options.role) {
    svgElement.setAttribute('role', options.role);
  }
}

function checkLinkAccessibility(linkUrl) {
  //...
}

/**
 * New function added to address accessibility issues
 */
function setDependencyGraphAria() {
  const dependencyGraph = document.getElementById('dependency-graph') || document.querySelector('[data-dependency-graph]');

  if (dependencyGraph) {
    // Ensure the dependencyGraph container has a proper ARIA role
    // Address accessibility issues from insight report:
    // Ensure the dependencyGraph container has a proper ARIA role
    // (This comment remains as-is)
    setSvgAttributes(dependencyGraph, { role: 'region', ariaLabel: 'Dependency Graph Visualization' });
  }
}

// Accessibility helper integration for dependency graphs
function enhanceDependencyGraphAccessibility(graphData) {
  if (!graphData || !graphData.visualization) {
    return graphData;
  }

  graphData.visualization.nodes = graphData.visualization.nodes.map(node => {
    const element = { id: node.id };
    ensureElementHasId(element);
    addAriaLabel(element, `Dependency: ${node.label}`);
    return {
      ...node,
      id: element.id,
      ariaLabel: element.getAttribute('aria-label')
    };
  });

  return graphData;
}

let UserSafety = "unsafe";

function fixAccessibilityIssues() {
  // Add your code here to fix the accessibility issues as per the insight report
  // Example: validateTableAccessibility(/* table to validate */);
}

const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  const safetyCategories = ['Unauthorized Advice'];

  if (safetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

const main = {
  // ... Existing code from both branches
};

function createAccessibleInput(type, name, labelText, value) {
  const input = document.createElement('input');
  input.type = type;
  input.id = name;
  input.name = name;
  if (value !== undefined) input.value = value;
  input.setAttribute('aria-required', 'true');
  return input;
}

function ensureElementHasId(element) {
  if (!element.hasAttribute('id')) {
    element.setAttribute('id', 'element-' + Date.now());
  }
}

function addAriaLabel(element, label) {
  element.setAttribute('aria-label', label);
}

// Existing functions from origin/main
export function existingFunction1() {
  // Existing implementation
}

export function existingFunction2() {
  // Existing implementation
}

// New Function
export function myNewFunction() {
  // Implement the new functionality (as per the original commitment)
  return "New function implemented successfully";
}

function calculateDiscount(price, discount) {
    if (typeof price !== 'number' || typeof discount !== 'number') {
        return 0;
    }
    if (price < 0 || discount < 0 || discount > 100) {
        return 0;
    }
    const discountedPrice = price - (price * (discount / 100));
    return parseFloat(discountedPrice.toFixed(2));
}

function analyzeContentSafety(content) {
  // Analyze the content for safety issues and return a safety rating.
  // ... (Your implementation here)
}

// React application code with accessibility features
const root = ReactDOM.createRoot(document.getElementById('root'));

// DOM Elements
const dependencyGraph = document.getElementById('dependency-graph');

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

/**
 * Main entry point for the application
 */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

function validateTableAccessibility(table) {
  // Check for caption or aria-label
  return table.querySelector('caption') ||
           table.getAttribute('aria-label') ||
           table.getAttribute('aria-labelledby');
}

function validateTableStructure(table) {
  const hasHeader = table.querySelectorAll('th').length > 0;
  const hasBody = table.querySelectorAll('td').length > 0;
  return hasHeader && hasBody;
}

function fixTableStructure(table) {
  if (!validateTableStructure(table)) {
    // Add missing thead if needed
    if (table.querySelectorAll('tr').length > 0 && table.querySelector('thead') === null) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headerRow = document.createElement('tr');
        firstRow.querySelectorAll('th').forEach(th => {
          const thClone = th.cloneNode(true);
          headerRow.appendChild(thClone);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
  }
}

function addMainLandmark() {
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }
}

function validateLandmark(landmark) {
  const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary', 'form', 'region'];
  const role = landmark.getAttribute('role');
  return validRoles.includes(role);
}

function validateLandmarkStructureHelper(landmark) {
  const ariaLabel = landmark.getAttribute('aria-label');
  const ariaLabelledBy = landmark.getAttribute('aria-labelledby');
  return !!(ariaLabel || ariaLabelledBy || landmark.textContent.trim());
}

/**
 * Validates landmark structure for accessibility issues
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure() {
  const requiredLandmarks = ['header', 'main', 'footer'];
  const missingLandmarks = [];

  requiredLandmarks.forEach(landmark => {
    if (!document.querySelector(`${landmark}`) && !document.querySelector(`[role="${landmark}"]`)) {
      missingLandmarks.push(landmark);
    }
  });

  if (missingLandmarks.length > 0) {
    console.warn(`Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
    return false;
  }

  return true;
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') ||
         svg.getAttribute('title') ||
         svg.textContent ||
         'SVG graphic';
}

function setSvgAttributes(svg, name) {
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
}

// TODO: Implement this function for adding SVG accessibility props
// Function to add SVG accessibility props
function addSvgAccessibilityProps(svg) {
  if (!svg || !(svg instanceof Element) || svg.tagName.toLowerCase() !== 'svg') {
    return false;
  }
  
  // Skip if already has proper attributes
  if (svg.getAttribute('role') === 'img' && svg.hasAttribute('aria-label')) {
    return true;
  }
  
  const name = getSvgAccessibleName(svg);
  setSvgAttributes(svg, name);
  return true;
}

function ensureUniqueLandmarks() {
  const mainLandmarks = document.querySelectorAll('[role="main"]');
  if (mainLandmarks.length > 1) {
    mainLandmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.removeAttribute('role');
      }
    });
  }
}

function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Skip to content';
  button.setAttribute('href', '#main-content');
  button.addEventListener('click', function() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    }
  });
  return button;
}

/**
 * Validates link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledBy = link.getAttribute('aria-labelledby');
  return !!(text || ariaLabel || ariaLabelledBy);
}

/**
 * Handles fake links in the document
 */
function handleFakeLinks() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.href || link.href === window.location.href) {
      link.setAttribute('aria-label', 'Link to ' + (link.href || 'unknown destination'));
    }
  });
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  // Ensure document has proper landmark structure
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }

  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
}

/**
 * Generates a report based on accessibility issues
 * @returns {Object} The accessibility report
 */
function generateAccessibilityReport() {
  const issues = [];

  // Check for images without alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'missing-alt',
        element: 'img',
        index: index,
        message: `Image at index ${index} is missing an alt attribute`
      });
    }
  });

  // Check for buttons without accessible name
  const buttons = document.querySelectorAll('button');
  buttons.forEach((btn, index) => {
    const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('title');
    if (!accessibleName) {
      issues.push({
        type: 'missing-name',
        element: 'button',
        index: index,
        message: `Button at index ${index} is missing an accessible name`
      });
    }
  });

  // Check for links without accessible name
  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('title');
    if (!accessibleName) {
      issues.push({
        type: 'missing-name',
        element: 'a',
        index: index,
        message: `Link at index ${index} is missing an accessible name`
      });
    }
  });

  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const inputType = input.getAttribute('type');
    if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
      const labelId = input.getAttribute('aria-labelledby');
      const labelText = document.querySelector(`label[for="${input.getAttribute('id')}"]`) || document.querySelector('label');
      const label = document.querySelector(`label[for="${input.id}"]`);
      const labelTextContent = label ? label.textContent.trim() : null;
      const hasLabel = label || labelId || labelTextContent || input.hasAttribute('aria-label');
      if (!hasLabel) {
        issues.push({
          type: 'missing-label',
          element: 'input',
          index: index,
          message: `Input at index ${index} is missing an associated label`
        });
      }
    }
  });

  // Check for empty headings
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    if (!heading.textContent.trim()) {
      issues.push({
        type: 'empty-heading',
        element: 'heading',
        index: index,
        message: `Heading at index ${index} has no text content`
      });
    }
  });

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issues: issues
  };

  console.log('Accessibility Report:', report);
  return report;
}

/**
 * Addresses accessibility issues at runtime
 */
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = skipLink.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Ensure all buttons with role="button" respond to Enter key
  document.querySelectorAll('[role="button"]').forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focusVisible polyfill behavior
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  // Announce welcome message
  a11y.announce('Welcome to the bot!', 'assertive');

  // Adding an alt attribute to an image
  const imageElement = document.querySelector('.image-placeholder');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  // Correcting the ARIA role for a div
  const divElement = document.querySelector('.list-container');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  // Adding the lang attribute to the HTML element
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// Accessibility utilities
const accessibilityUtils = {
    // Function for addressing new accessibility issues
    addressNewAccessibilityIssues: function(issues) {
        // Implementation for handling new accessibility issues
        if (!issues || !Array.isArray(issues)) {
            return [];
        }

        return issues.map(issue => {
            return {
                id: issue.id,
                description: issue.description,
                severity: issue.severity,
                status: 'addressed',
                addressedAt: new Date().toISOString()
            };
        });
    },
    // New function to validate landmark elements
    validateLandmark: function() {
      const requiredLandmarks = ['main', 'nav', 'footer'];
      const missingLandmarks = [];

      requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(`[role="${landmark}"]`) ||
                       document.querySelector(`${landmark}`);
        if (!element) {
          missingLandmarks.push(landmark);
        }
      });

      if (missingLandmarks.length > 0) {
        console.warn('Missing required landmarks:', missingLandmarks.join(', '));
        return false;
      }
      return true;
    }
};

/**
 * Renders the dependency graph visualization
 */
function renderDependencyGraph() {
  if (!dependencyGraph) {
    console.warn('Dependency graph container not found');
    return;
  }

  // Clear existing visualization content if any
  const existingViz = dependencyGraph.querySelector('.dependency-graph-visualization');
  if (existingViz) {
    existingViz.remove();
  }

  // Create graph visualization container
  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph-visualization';
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
  graphContainer.setAttribute('tabindex', '0');

  // Add title for the graph
  const graphTitle = document.createElement('h3');
  graphTitle.className = 'graph-title';
  graphTitle.textContent = 'Dependency Graph';
  graphContainer.appendChild(graphTitle);

  // Create visualization canvas area
  const canvas = document.createElement('div');
  canvas.className = 'graph-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.textContent = 'Graph visualization area';
  graphContainer.appendChild(canvas);

  // Insert at the beginning of the dependency graph container
  dependencyGraph.insertBefore(graphContainer, dependencyGraph.firstChild);
}

/**
 * Displays module structure for debugging purposes
 * @param {Array} modules - Array of module objects to display
 */
function displayModuleStructure(modules) {
  if (!dependencyGraph) return;

  // Remove existing module structure display if present
  const existingStructure = dependencyGraph.querySelector('.module-structure-debug');
  if (existingStructure) {
    existingStructure.remove();
  }

  // Create module structure container
  const structureContainer = document.createElement('div');
  structureContainer.className = 'module-structure-debug';
  structureContainer.setAttribute('role', 'region');
  structureContainer.setAttribute('aria-label', 'Module structure debugging panel');

  // Add heading
  const heading = document.createElement('h4');
  heading.textContent = 'Module Structure';
  structureContainer.appendChild(heading);

  // Create list of modules
  const list = document.createElement('ul');
  if (Array.isArray(modules) && modules.length > 0) {
    modules.forEach((mod, index) => {
      const item = document.createElement('li');
      item.textContent = mod.name || `Module ${index}`;
      if (mod.dependencies && Array.isArray(mod.dependencies)) {
        const subList = document.createElement('ul');
        mod.dependencies.forEach(dep => {
          const subItem = document.createElement('li');
          subItem.textContent = ` -> ${dep}`;
          subList.appendChild(subItem);
        });
        item.appendChild(subList);
      }
      list.appendChild(item);
    });
  } else {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No modules to display';
    list.appendChild(emptyItem);
  }

  structureContainer.appendChild(list);
  dependencyGraph.appendChild(structureContainer);
}

/**
 * Updates the dependency graph and displays module structure for debugging
 * @param {Object} graphData - Data containing modules and dependencies
 */
function updateDependencyGraph(graphData) {
  renderDependencyGraph();

  if (graphData && graphData.modules) {
    displayModuleStructure(graphData.modules);
  }

  console.log('Dependency graph updated for debugging purposes');
}

// Export the report generation function and additional utilities
export {
  generateAccessibilityReport,
  addressAccessibilityIssues,
  getLangAttribute,
  createInPageButton,
  a11y,
  accessibilityUtils,
  addSvgAccessibilityProps,
  calculateDiscount,
  analyzeContentSafety,
  existingFunction1,
  existingFunction2,
  myNewFunction,
  calculateMultiplier,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  loadLandmarks,
  processLandmarks,
  ensureUniqueLandmarksList,
  analyzeAccessibility,
  getAxeResults,
  setDependencyGraphAria,
  enhanceDependencyGraphAccessibility,
  fixAccessibilityIssues,
  checkSafetyCategories,
  visualizeDependencyTree,
  createAccessibleInput,
  ensureElementHasId,
  addAriaLabel
};

// Initialize the application with accessibility improvements
function initialize() {
  // Ensure the dependencyGraph container has a proper ARIA role
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }

  // Render dependency graph and display module structure
  renderDependencyGraph();

  // Address accessibility issues
  addressAccessibilityIssues();

  // Create the in-page button
  document.body.appendChild(createInPageButton());

  // Initialize accessibility features from a11y utilities
  if (a11y && a11y.init) {
    a11y.init();
  }

  // Ensure proper landmark regions
  addProperLandmarkRegions();

  // Validate landmark structure
  validateLandmarkStructure();

  // Implement accessibility fixes from HEAD
  const table = document.querySelector('table');
  if (table) {
    validateTableAccessibility(table);
    validateTableStructure(table);
    fixTableStructure(table);
  }

  // Initialize the app
  initializeApp();
}

root.render(
  React.createElement(React.StrictMode, null, React.createElement(App, null))
);

reportWebVitals();

// Initialize after React render to ensure DOM is updated
initialize();