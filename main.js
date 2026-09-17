// Import required module(s) - for fixing table structure issues
import './table-styles.css';

// main.js - Entry point for the application

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch)
// Code for version 1 implementation goes here.

let newFeatureV1 = (param) => {
  // Version 1 implementation of the new feature
  console.log('Version 1 feature executed with:', param);
  return { version: 1, status: 'active', data: param };
};

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// This is a simple utility library with added dependency graph rendering and module structure display functionalities, bot logic for Screeps and functions to ensure the element has an id and add an aria-label.

// This is a simple utility library with added dependency graph rendering and module structure display functionalities, bot logic for Screeps and functions to ensure the element has an id and add an aria-label.

let internalFunction1 = (arg1, arg2) => {
  // Implementation of the new function (adjust as necessary)
};

let internalFunction2 = () => {
  // Implementation of the new function (adjust as necessary)
};

/**
 * Generates a unique ID with a given prefix
 * @param {string} prefix - The prefix for the generated ID
 * @returns {string} A unique ID
 */
function generateUniqueId(prefix) {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Ensures the element has an id. If the element doesn't have an id, generates one.
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Optional prefix for the generated id
 * @returns {string} The id of the element
 */
export function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = `${prefix}-${Date.now().toString(36)}`;
  element.id = generatedId;
  return generatedId;
}

export function anotherFunction() {
  // More existing functionality
}

/**
 * Adds an aria-label to the element if it doesn't already have one
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {void}
 */
export function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Counts the number of dependencies in a module
 * @param {Object} module - The module object to count dependencies for
 * @returns {number} The number of dependencies in the module
 */
function countDependencies(module) {
  if (!module || typeof module !== 'object') {
    return 0;
  }
  
  let count = 0;
  
  for (const key in module) {
    if (module.hasOwnProperty(key)) {
      const value = module[key];
      if (typeof value === 'function' || typeof value === 'object') {
        count++;
      }
    }
  }
  
  return count;
}

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

/**
 * Renders a dependency graph showing module relationships
 * @param {Object} modules - Object containing module information with dependencies
 * @returns {Object} Graph data structure with nodes and edges
 */
function renderDependencyGraph(modules = {}) {
  const graph = {
    nodes: [],
    edges: []
  };

  if (!modules || typeof modules !== 'object') {
    console.log('No modules provided for dependency graph');
    return graph;
  }

  // Create nodes for each module
  Object.keys(modules).forEach(moduleName => {
    graph.nodes.push({
      id: moduleName,
      label: moduleName
    });

    // Check for dependencies
    const module = modules[moduleName];
    if (module.dependencies && Array.isArray(module.dependencies)) {
      module.dependencies.forEach(dep => {
        graph.edges.push({
          from: moduleName,
          to: dep
        });
      });
    }
  });

  console.log('Dependency graph rendered:', graph);
  return graph;
}

/**
 * Displays the module structure for debugging purposes
 * Helps developers understand the current structure of loaded modules.
 * @param {Object} modules - Object containing module information
 * @returns {Object} Module structure object with names and metadata
 */
function displayModuleStructure(modules = {}) {
  if (!modules || typeof modules !== 'object') {
    console.log('No modules provided for structure display');
    return {};
  }

  const structure = {};

  Object.keys(modules).forEach(moduleName => {
    const module = modules[moduleName];
    structure[moduleName] = {
      name: moduleName,
      dependencies: module.dependencies || [],
      exports: module.exports ? Object.keys(module.exports) : []
    };
  });

  console.log('Displaying module structure for modules:', structure);
  return structure;
}

/**
 * Sets the lang attribute on the HTML element based on the page content
 * @param {string} languageCode - The language code (e.g., 'en', 'es', 'fr')
 */
export function setLanguageAttribute(languageCode) {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    ... languageCode);
  }
}

/**
 * Ensures all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
 * @param {HTMLElement[]} landmarks - Array of landmark elements to ensure unique ids
 * @param {string} prefix - Optional prefix for the generated id
 * @returns {string[]} Array of ids for all landmarks
 */
function ensureUniqueLandmarks(landmarks, prefix = 'landmark') {
  if (!landmarks || !Array.isArray(landmarks)) {
    throw new Error('Landmarks array is required');
  }

  const ids = [];
  const usedIds = new Set();

  landmarks.forEach((landmark, index) => {
    if (!landmark) {
      return;
    }

    if (landmark.id) {
      if (usedIds.has(landmark.id)) {
        const newId = `${prefix}-${index}`;
        landmark.id = newId;
        usedIds.add(newId);
        ids.push(newId);
      } else {
        usedIds.add(landmark.id);
        ids.push(landmark.id);
      }
    } else {
      let generatedId = `${prefix}-${index}`;
      while (usedIds.has(generatedId)) {
        generatedId = `${prefix}-${index}-${Math.random().toString(36).substr(2, 9)}`;
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
      ids.push(generatedId);
    }
  });

  return ids;
}

/**
 * Gets the lang attribute from the HTML element
 * @returns {string|null} The language code or null if not set
 */
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

/**
 * Validates landmark structure for proper accessibility
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Validation result with structure issues
 */
function validateLandmarkStructure(root = document) {
  const issues = [];
  
  if (!root) {
    return { valid: false, issues: ['Root element is required'] };
  }
  
  // Check for proper landmark nesting
  const landmarks = root.querySelectorAll('header, nav, main, footer, aside, section, article, [role]');
  
  // Check for proper use of section elements
  const sections = root.querySelectorAll('section, article');
  sections.forEach((section, index) => {
    const hasLabel = section.getAttribute('aria-label') || 
                     section.getAttribute('aria-labelledby') || 
                     section.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      issues.push(`Section/Article at index ${index} should have an accessible name via aria-label, aria-labelledby, or heading`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates link accessibility requirements
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Validation result with link issues
 */
function validateLinkAccessibility(root = document) {
  const issues = [];
  
  if (!root) {
    return { valid: false, issues: ['Root element is required'] };
  }
  
  // Check for links without accessible names
  const links = root.querySelectorAll('a');
  links.forEach((link, index) => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label');
    const hasAriaLabelledby = link.getAttribute('aria-labelledby');
    const hasTitle = link.getAttribute('title');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      issues.push(`Link at index ${index} has no accessible name`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Handles fake links (elements with click handlers that look like links)
 * @param {Document|Element} root - Root element to search within
 * @returns {Object} Result with fake links found
 */
function handleFakeLinks(root = document) {
  const fakeLinks = [];
  
  if (!root) {
    return { found: false, elements: [] };
  }
  
  // Find elements that have click handlers but are not buttons or links