// Import required module(s) - for fixing table structure issues
import './table-styles.css';

// main.js - Entry point for the application

// This is a simple utility library with added dependency graph rendering and module structure display functionalities, bot logic for Screeps and functions to ensure the element has an id and add an aria-label.

/**
 * Ensures the element has an id. If the element doesn't have an id, generates one.
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Optional prefix for the generated id
 * @returns {string} The id of the element
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = generatedId;
  return generatedId;
}

/**
 * Adds an aria-label to the element if it doesn't already have one
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {void}
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Sets the lang attribute on the HTML element based on the page content
 * @param {string} languageCode - The language code (e.g., 'en', 'es', 'fr')
 */
function setLanguageAttribute(languageCode) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode);
  }
}

// Default language setting
setLanguageAttribute('en');

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @param {string} context - Optional context to help generate a descriptive name
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svgElement, context = '') {
  if (!svgElement) {
    return '';
  }

  // Check if the SVG already has an aria-label
  const existingAriaLabel = svgElement.getAttribute('aria-label');
  if (existingAriaLabel) {
    return existingAriaLabel;
  }

  // Check for a title element within the SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }

  // Generate a descriptive name based on context if provided
  if (context) {
    return context;
  }

  // Check for an id that might indicate purpose
  if (svgElement.id) {
    return svgElement.id.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  // Default fallback
  return 'Decorative SVG image';
}

/**
 * Sets accessibility attributes on an SVG element
 * @param {SVGElement} svgElement - The SVG element to set attributes on
 * @param {string} accessibleName - Optional accessible name (if not provided, will be generated)
 * @returns {void}
 */
function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement) {
    return;
  }

  // Get the accessible name if not provided
  const name = accessibleName || getSvgAccessibleName(svgElement);

  // Set aria-label with the accessible name
  svgElement.setAttribute('aria-label', name);

  // Ensure the SVG has a role attribute for better accessibility
  svgElement.setAttribute('role', 'img');

  // Check if SVG has a title element, if not add one for additional support
  let titleElement = svgElement.querySelector('title');
  if (!titleElement) {
    titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleElement.textContent = name;
    // Insert title as first child for proper accessibility
    if (svgElement.firstChild) {
      svgElement.insertBefore(titleElement, svgElement.firstChild);
    } else {
      svgElement.appendChild(titleElement);
    }
  }
}

// Simple interactive page with content rotation functionality
function initApp() {
  const container = document.getElementById('container');
  
  // Create heading
  const h1 = document.createElement('h1');
  h1.textContent = 'My Page';
  h1.id = 'title';
  container.appendChild(h1);
  
  // Create content area
  const content = document.createElement('div');
  content.id = 'content';
  content.style.transition = 'transform 0.3s ease';
  content.style.transformOrigin = 'center center';
  container.appendChild(content);
  
  // Create button for rotating back (FIXED: changed from <a href="#"> to <button>)
  const unrotateBtn = document.createElement('button');
  unrotateBtn.id = 'unrotate';
  unrotateBtn.textContent = 'rotate back';
  unrotateBtn.setAttribute('aria-label', 'Rotate content back to original position');
  unrotateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    content.style.transform = 'rotate(0deg)';
  });
  container.appendChild(unrotateBtn);
  
  // Call the dependency graph rendering utility
  renderDependencyGraph();
}

// Placeholder for module structure display utility.
// Helps developers understand the current structure of loaded modules.
function displayModuleStructure(modules) {
  // Future implementation could format and print module hierarchy
  console.log('Displaying module structure for modules:', modules);
  return {};
}

// Function to reset body rotation
export function resetRotation() {
  document.body.style.transform = 'rotate(0deg)';
  document.body.style.transition = 'transform 0.3s ease';
}

function add(a, b) {
  return a + b;
}

// TODO: Re-add the required exports for functionA and functionB
// Assuming that they are objects with properties X, Y, and Z
const functionA = {
  // ... (Preserve the existing code for functionA)

  X: functionX, // Do not remove or rename this export
  Y: functionY, // Do not remove or rename this export
  Z: functionZ, // Do not remove or rename this export
};

// TODO: Identify and update specific functions that render dependency graphs or display module structure for debugging purposes.
function renderDependencyGraph(modules) {
  // Future implementation could traverse and log module dependencies
  console.log('Rendering dependency graph for modules:', modules);
  return {};
}

function displayModuleStructure(modules) {
  // Future implementation could format and print module hierarchy
  console.log('Displaying module structure for modules:', modules);
  return {};
}

// Placeholder for bot logic for Screeps
function loop() {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      if (creep.store.getFreeCapacity() > 0) {
        let source = Game.getObjectById(creep.memory.sourceId);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
  }
}

const functionB = {
  // ... (Preserve the existing code for functionB)

  X: functionXb, // Do not remove or rename this export
  Y: functionYb, // Do not remove or rename this export
  Z: functionZb, // Do not remove or rename this export
};

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  setLanguageAttribute,
  initApp,
  displayModuleStructure,
  functionA,
  functionB,
  loop,
  getSvgAccessibleName,
  setSvgAttributes
};