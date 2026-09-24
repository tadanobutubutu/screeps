const { dependencyGraphContent, indexContent } = require('./dependencyGraphContent');
const { renderDependencyGraph, renderIndex } = require('./indexContent');

// Requiring new accessibility helper functions from the conflicting version
import React from 'react';
import { render } from 'react-dom';
import { addAccessibleName, addLangAttribute, fixTableStructure, fixLandmarkIssues, addMainLandmark, addLandmarkRegions, ensureUniqueLandmarks, uniqueLandmarks, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, googleSignIn, decodeJwtResponse, fixButtonIdentifiers, ensureElementHasId, addAriaLabel, renderDependencyGraphs } from './AccessibilityHelpers';

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  return dependencyGraphContent(deps, options);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  return indexContent(data, options);
}

// Existing code for creating 'main' element, adjusted to use change from conflicting version
let mainElement = document.querySelector('main, [role="main"]');
if (mainElement) {
  return mainElement;
}

const elementsToExclude = [];
const landmarks = document.querySelectorAll(
  'header, nav, aside, footer, ' +
  '[role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]'
);
landmarks.forEach(landmark => elementsToExclude.push(landmark));

mainElement = document.createElement('main');
mainElement.setAttribute('role', 'main');

const bodyChildren = Array.from(document.body.children);
bodyChildren.forEach(child => {
  if (!elementsToExclude.includes(child)) {
    mainElement.appendChild(child);
  }
});

document.body.appendChild(mainElement);

// New function for adding accessible names to SVGs
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

/**
 * New function for rendering the main index view with a custom layout
 * @param {Object} data - View data
 * @param {Object} options - Rendering options including custom layout
 * @returns {string} Rendered index HTML with custom layout
 */
function renderIndexWithCustomLayout(data, options = {}) {
  // Use indexContent from the imported module
  const indexContentHTML = indexContent(data, options);
  // Apply custom layout to the indexContentHTML
  const customLayoutContent = `<div class="${options.layoutClass}">${indexContentHTML}</div>`;
  return customLayoutContent;
}

// Accessibility improvements from the other branch

// Other code...

// Adjusted checkLandmarks function, using new functions from the conflicting version
function checkLandmarks(container = document) {
  let landmarks = fixLandmarkIssues(container);
  ensureUniqueLandmarks();
  fixTableStructure(container);
  // ... other code for checkLandmarks remains the same
}

/**
 * REACT_036: Fix all fake link issues in container
 */
export function fixFakeLinkIssues(container) {
  if (!container) return null;
  
  const clickableElements = container.querySelectorAll('[onclick]');
  clickableElements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (tagName !== 'a' && tagName !== 'button' && tagName !== 'input') {
      fixFakeLinkIssue(el);
    }
  });
  
  return container;
}

/**
 * REACT_037: Google sign-in logic
 */
export function googleSignIn() {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        callback: async (response) => {
          try {
            // Handle the token
            const userInfo = decodeJwtResponse(response.credential);
            resolve({
              success: true,
              user: userInfo
            });
          } catch (error) {
            reject(error);
          }
        }
      });
      
      window.google.accounts.id.prompt();
    } else {
      reject(new Error('Google Sign-In not available'));
    }
  });
}

// Helper to decode JWT
function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  );
  return JSON.parse(jsonPayload);
}

/**
 * REACT_040: Fix button identifiers
 */
export function fixButtonIdentifiers(container) {
  if (!container) return null;
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    // Generate unique id if missing
    if (!button.id) {
      const existingId = button.getAttribute('data-testid') || button.getAttribute('aria-label');
      if (existingId) {
        button.id = existingId.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      } else {
        button.id = `button-${index + 1}`;
      }
    }
    
    // Remove generic placeholder ids
    if (button.id === 'my-button' || button.id === 'button') {
      button.id = `button-${Date.now()}-${index}`;
    }
  });
  
  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    renderDependencyGraph,
    renderSimpleDependencyGraph
  };
}

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
}

// New function to add/fix 4 landmark issues
function addMainLandmark() {
  if (typeof document === 'undefined') {
    return;
  }

  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  document.body.insertBefore(mainElement, document.body.firstChild);
}

// New function to ensure unique landmarks
function uniqueLandmarks() {
  const roles = ['banner', 'header', 'navigation', 'main', 'contentinfo', 'complementary', 'navigation', 'region'];
  roles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      console.warn(`Multiple elements with role "${role}" detected. Ensure each role is unique.`);
    }
  });
}

/**
 * NEW: Add aria-label to element
 */
export function addAriaLabel(element, label) {
  if (!element) return null;
  
  if (!element.getAttribute('aria-label') && label) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * NEW: Ensure element has an id
 */
export function ensureElementHasId(element, prefix = 'element') {
  if (!element) return null;
  
  if (!element.id) {
    element.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return element;
}

/**
 * NEW: Add aria-label to element
 */
export function addAriaLabel(element, label) {
  if (!element) return null;
  
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', label);
  }
  
  return element;
}

/**
 * NEW: Render dependency graphs
 */
export function renderDependencyGraphs(container, dependencies = []) {
  if (!container) return null;
  
  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', `Dependency graph with ${dependencies.length} dependencies`);
  graphContainer.id = 'dependency-graph';
  
  // Create SVG for graph visualization
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('aria-hidden', 'true');
  
  // Add accessible description for screen readers
  const description = document.createElement('div');
  description.setAttribute('role', 'group');
  description.setAttribute('aria-label', 'Dependency list');
  description.style.position = 'absolute';
  description.style.width = '1px';
  description.style.height = '1px';
  description.style.padding = '0';
  description.style.margin = '-1px';
  description.style.overflow = 'hidden';
  description.style.clip = 'rect(0, 0, 0, 0)';
  description.style.whiteSpace = 'nowrap';
  description.style.border = '0';
  
  // Build accessible list of dependencies
  dependencies.forEach((dep, index) => {
    const depItem = document.createElement('div');
    depItem.textContent = `Dependency ${index + 1}: ${dep.name || dep.label || 'Unnamed'}`;
    description.appendChild(depItem);
  });
  
  // Calculate node positions
  const nodePositions = new Map();
  const nodeRadius = 20;
  const padding = 40;
  const cols = Math.ceil(Math.sqrt(dependencies.length));
  
  dependencies.forEach((dep, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = padding + col * (nodeRadius * 3);
    const y = padding + row * (nodeRadius * 3);
    nodePositions.set(index, { x, y, dep });
  });
  
  // Draw edges between dependencies
  dependencies.forEach((dep, fromIndex) => {
    if (dep.dependencies) {
      dep.dependencies.forEach(depIndex => {
        const from = nodePositions.get(fromIndex);
        const to = nodePositions.get(depIndex);
        
        if (from && to) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', from.x);
          line.setAttribute('y1', from.y);
          line.setAttribute('x2', to.x);
          line.setAttribute('y2', to.y);
          line.setAttribute('stroke', '#666');
          line.setAttribute('stroke-width', '2');
          svg.appendChild(line);
        }
      });
    }
  });
  
  // Draw nodes
  nodePositions.forEach((pos, index) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', nodeRadius);
    circle.setAttribute('fill', '#4a90d9');
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('tabindex', '0');
    circle.setAttribute('role', 'button');
    circle.setAttribute('aria-label', `Dependency ${index + 1}: ${pos.dep.name || pos.dep.label || 'Unnamed'}`);
    svg.appendChild(circle);
    
    // Add label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x);
    text.setAttribute('y', pos.y + nodeRadius + 15);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#333');
    text.setAttribute('font-size', '12');
    text.textContent = pos.dep.name || pos.dep.label || `Dep ${index + 1}`;
    svg.appendChild(text);
  });
  
  graphContainer.appendChild(svg);
  graphContainer.appendChild(description);
  container.appendChild(graphContainer);
  
  return graphContainer;
}

// Preserve all existing exports
module.exports = {
  renderDependencyGraph,
  renderIndex,
  // Preserve any other existing exports here
  newFunction,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  addMainLandmark,
  uniqueLandmarks,
  addAriaLabel,
  ensureElementHasId,
  renderDependencyGraphs,
  initializeAccessibility,
  setupKeyboardNavigation,
  trapFocus,
  createAnnouncer,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  isEmpty,
  capitalize,
  getRandomInt,
  clamp,
  deepClone,
  myAccessibleFunction
};

// Export all utility functions
export {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  accessibilityUtils,
  trapFocus,
  setupKeyboardNavigation,
  implementAccessibilityFixesFromReport,
  renderGraphIndex,
  newExportedFunction,
  myAccessibleFunction,
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
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
  createAnnouncer,
  prefersReducedMotion,
  isEmpty,
  capitalize,
  getRandomInt,
  clamp,
  deepClone
};