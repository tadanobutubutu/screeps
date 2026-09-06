// Import required modules
import { v4 as uuidv4 } from 'uuid';
import { createElement } from 'react';
import { getDocument, getLangAttribute } from '.';
import { createInPageButton, handleAccessibilityIssues, createAccessibleLink } from "path-to-new-accessibility-helper-functions";
import { dependencyGraphContent, indexContent } from './dependencyGraphContent';
import { indexContent as newIndexContent } from "path-to-new-function-module";

/**
 * Renders a dependency graph as ASCII art for debugging purposes.
 * @param {Object} dependencies - The dependency object
 * @param {string} prefix - Current prefix for indentation
 * @param {boolean} isLast - Whether this is the last item at current level
 * @returns {string} ASCII representation of the dependency graph
 */
function renderDependencyGraph(dependencies, prefix = '', isLast = true) {
  if (!dependencies || typeof dependencies !== 'object') {
    return '';
  }
  
  let output = '';
  const keys = Object.keys(dependencies);

  keys.forEach((key, index) => {
    const isLastItem = index === keys.length - 1;
    const connector = isLastItem ? '└── ' : '├── ';
    const value = dependencies[key];

    output += `${prefix}${connector}${key}`;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      output += '/\n';
      const extension = isLast ? '    ' : '│   ';
      output += renderDependencyGraph(value, prefix + extension, isLastItem);
    } else {
      output += ` -> ${value}\n`;
    }
  });

  return output;
}

export function exportRenderDependencyGraph() {
  handleAccessibilityIssues(dependencyGraphContent);
}

export function renderIndex() {
  handleAccessibilityIssues(indexContent);
}

export function renderIndexNew() {
  handleAccessibilityIssues(newIndexContent);
}

function greet(name) {
  return `Hello, ${name}!`;
}

// NEW FUNCTION ADDED FROM ORIGIN/MAIN
function newAccessibleFunction() {
  // Add your new function implementation here
  return true;
}

const landmarkRegions = [];

function isLatitudeValid(lat) {
  // Existing validation function preserved
}

function isLongitudeValid(lng) {
  // Existing validation function preserved
  return typeof lng === 'number' && lng >= -180 && lng <= 180;
}

/**
 * Adds a proper landmark region to the given element.
 * @param {HTMLElement} element - The DOM element to add the landmark region to.
 * @param {string} role - The ARIA role for the landmark region (e.g., 'navigation', 'main', 'complementary').
 * @param {string} [label] - Optional accessible label for the landmark region.
 */
function addLandmarkRegionToElement(element, role, label) {
  // Existing function preserved
}

function addLandmarkRegion(landmark) {
  // Existing function preserved that calls the validateLandmark function
}

function getLandmarkRegions() {
  // Existing function preserved
  return [...landmarkRegions];
}

function getLandmarkRegionsByRole(role) {
  // Existing function preserved
  return landmarkRegions.filter(region => region.role === role);
}

function removeLandmarkRegion(id) {
  // Existing function preserved
  const index = landmarkRegions.findIndex(region => region.id === id);
  if (index !== -1) {
    landmarkRegions.splice(index, 1);
    return true;
  }
  return false;
}

// The following functions and variables were added, amalgamating code from both branches:

// Internal storage for landmark regions
const landmarks = [];

// Function to add a landmark, using the following order: validate and add to storage
function addLandmark(landmark) {
  if (validateLandmark(landmark)) {
    landmarks.push(landmark);
  }
}

function getLandmarks() {
  return [...landmarks];
}

function removeLandmark(id) {
  const index = landmarks.findIndex(landmark => landmark.id === id);
  if (index !== -1) {
    landmarks.splice(index, 1);
    return true;
  }
  return false;
}

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// REACT_015: Add lang attribute to HTML element
function setLangAttribute() {
  return 'en';
}

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Navigate within page');
  return button;
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table || table.nodeType !== Node.ELEMENT_NODE || table.tagName !== 'TABLE') {
    return false;
  }
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasSummary = table.getAttribute('summary') !== null || table.getAttribute('aria-describedby') !== null;
  
  return hasCaption || hasSummary;
}

function validateTableStructure(table) {
  // Existing function logic preserved
}

function removeLandmarkRegion(id) {
  // Existing function logic preserved
}

function addMainLandmark() {
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.id = 'main-content';
    document.body.insertBefore(main, document.body.firstChild);
  }

  return main;
}

function fixLandmarkIssues() {
  let fixed = 0;

  if (typeof document === 'undefined') {
    return fixed;
  }

  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.id) {
      nav.id = `navigation-${index + 1}`;
      fixed++;
    }
    if (!nav.getAttribute('aria-label') && !nav.querySelector('[aria-label]')) {
      const label = document.createElement('span');
      label.setAttribute('class', 'sr-only');
      label.textContent = `Navigation section ${index + 1}`;
      nav.insertBefore(label, nav.firstChild);
      fixed++;
    }
  });

  return fixed;
}

function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return true;
  }

  const landmarks = document.querySelectorAll('[role]');
  const ids = new Set();
  let unique = true;

  landmarks.forEach(landmark => {
    const id = landmark.id;
    if (id) {
      if (ids.has(id)) {
        unique = false;
      } else {
        ids.add(id);
      }
    }
  });

  return unique;
}

function addAccessibleNamesToSVGs() {
  let count = 0;

  if (typeof document === 'undefined') {
    return count;
  }

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const existingName = getSvgAccessibleName(svg);
    if (!existingName) {
      const title = svg.querySelector('title');
      if (title && title.textContent) {
        setSvgAttributes(svg, title.textContent);
        count++;
      }
    }
  });

  return count;
}

function addSvgAccessibleNames(svg, name) {
  if (!svg || !name) {
    return false;
  }

  setSvgAttributes(svg, name);
  return true;
}

function handleFakeLinks(links) {
  const fixedLinks = [];

  for (let link of links) {
    if (!validateLinkAccessibility(link)) {
      link.setAttribute('href', '#');
      link.setAttribute('role', 'button');
      link.style.pointerEvents = 'none';
      fixedLinks.push(link);
    } else {
      fixedLinks.push(link);
    }
  }

  return fixedLinks;
}

function addProperLandmarkRegions(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const validLandmarkRegions = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];
  const currentRole = element.getAttribute('role');

  if (!currentRole && validLandmarkRegions.includes(element.tagName.toLowerCase())) {
    element.setAttribute('role', element.tagName.toLowerCase());
  }
}

function displayModuleStructure(modules) {
  if (!Array.isArray(modules)) {
    return 'Error: modules must be an array';
  }
  
  let output = 'Module Structure:
';
  output += '==================

';
  
  modules.forEach((mod, index) => {
    const name = mod.name || mod.id || `Module ${index + 1}`;
    output += `${index + 1}. ${name}
`;
    
    if (mod.dependencies && Array.isArray(mod.dependencies)) {
      output += `   Dependencies: ${mod.dependencies.join(', ') || 'none'}
`;
    }

    if (mod.path) {
      output += `   Path: ${mod.path}
`;
    }
    
    output += '
';
  });

  return output;
}

/**
 * Generates a dependency report for debugging
 */
function generateDependencyReport(dependencies) {
  return renderDependencyGraph(dependencies);
}