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

  const generatedId = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
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

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.
function countDependencies(modules) {
  if (!modules) return 0;
  if (Array.isArray(modules)) return modules.length;
  let total = 0;
  for (const key in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, key)) {
      const val = modules[key];
      if (Array.isArray(val)) {
        total += val.length;
      } else if (val && typeof val === 'object' && Array.isArray(val.dependencies)) {
        total += val.dependencies.length;
      }
    }
  }
  return total;
}

/**
 * Renders a dependency graph visualization for the given modules
 * @param {Object[]} modules - Array of module objects with name and dependencies
 * @param {HTMLElement} [container] - Optional container element to render into
 * @returns {Object} Object containing the rendered graph data and any issues
 */
function renderDependencyGraph(modules = []) {
  const issues = [];
  
  // Validate modules input
  if (!Array.isArray(modules)) {
    issues.push('Modules must be an array');
    return { valid: false, issues, graph: null };
  }
  
  // Create the dependency graph structure
  const graph = {
    nodes: [],
    edges: []
  };
  
  // Process each module to build the graph
  modules.forEach((mod, index) => {
    if (!mod || typeof mod !== 'object') {
      issues.push(`Invalid module at index ${index}`);
      return;
    }
    
    const nodeId = mod.name || `module-${index}`;
    
    // Add node to graph
    if (!graph.nodes.find(n => n.id === nodeId)) {
      graph.nodes.push({
        id: nodeId,
        dependencies: mod.dependencies || []
      });
    }
    
    // Add edges for dependencies
    (mod.dependencies || []).forEach(dep => {
      graph.edges.push({
        from: nodeId,
        to: dep
      });
    });
  });
  
  // Log the dependency graph for debugging
  console.log('Rendering dependency graph for modules:', modules);
  console.log('Graph nodes:', graph.nodes);
  console.log('Graph edges:', graph.edges);
  
  return {
    valid: issues.length === 0,
    issues,
    graph
  };
}

/**
 * Displays the module structure for debugging purposes
 * @param {Object[]} modules - Array of module objects
 * @returns {Object} Formatted module hierarchy structure
 */
function displayModuleStructure(modules = []) {
  const structure = {
    totalModules: modules.length,
    modules: []
  };
  
  // Validate modules input
  if (!Array.isArray(modules)) {
    structure.issues = ['Modules must be an array'];
    return structure;
  }
  
  // Format each module for display
  modules.forEach((mod, index) => {
    if (!mod || typeof mod !== 'object') {
      return;
    }
    
    const moduleInfo = {
      name: mod.name || `module-${index}`,
      dependencies: mod.dependencies || [],
      dependents: []
    };
    
    structure.modules.push(moduleInfo);
  });
  
  // Find dependents for each module
  structure.modules.forEach(mod => {
    structure.modules.forEach(otherMod => {
      if (otherMod.dependencies.includes(mod.name)) {
        mod.dependents.push(otherMod.name);
      }
    });
  });
  
  // Future implementation could format and print module hierarchy
  console.log('Displaying module structure for modules:', modules);
  console.log('Module structure:', structure);
  
  return structure;
}

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
      let generatedId = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
      while (usedIds.has(generatedId)) {
        generatedId = `${prefix}-${Math.floor(Math.random() * 900000) + 100000}`;
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

// Default language setting
setLanguageAttribute('en');

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

// TODO: Update or create the affected functions to be accessible

let internalFunction1 = (arg1, arg2) => {
  // Implementation of the new function (adjust as necessary)
};

let internalFunction2 = () => {
  // Implementation of the new function (adjust as necessary)
};

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

  const generatedId = `${prefix}-${Math.floor(Math.random() * 900000) + 100000}`;
  element.id = generatedId;
  return generatedId;
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

// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Sets the lang attribute on the HTML element based on the page content
 * @param {string} languageCode - The language code (e.g., 'en', 'es', 'fr')
 */
function setLanguageAttribute(languageCode) {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode);
  }
}

// TODO: Address accessibility issues from insight report:

// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// Adds an aria-label to the dependencyGraph container if it doesn't already have one
function addDepGraphAriaLabel() {
  const container = document.querySelector('#dependencyGraph');
  addAriaLabel(container, 'Dependency Graph');
}

// Fixes 26 table structure issues for accessibility
// Ensures tables have proper headers, captions, and scope attributes
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label') || 'Data table';
      caption.style.caption-side = 'top';
      table.prepend(caption);
    }

    // Ensure proper header structure with scope attributes
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach((th) => {
      if (!th.getAttribute('scope')) {
        // Determine scope based on position
        const parent = th.parentElement;
        const isInThead = parent && parent.tagName === 'THEAD';
        th.setAttribute('scope', isInThead ? 'col' : 'row');
      }
    });
  });
  container.appendChild(unrotateBtn);

  // Call the dependency graph rendering utility
  renderDependencyGraph();
}

// Adds/fixes 2 landmark issues by ensuring a main landmark exists
export function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      // Wrap content in main element
      const children = Array.from(body.children).filter(
        (child) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'HEADER', 'FOOTER', 'NAV'].includes(child.tagName)
      );
      if (children.length > 0) {
        const firstChild = children[0];
        body.insertBefore(mainElement, firstChild);
        children.forEach((child) => mainElement.appendChild(child));
      } else {
        ids.add(landmark.id);
      }
    }
  }
  return mainElement;
}

// Adds accessible names to SVG elements that lack them
export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const hasAccessibleName =
      svg.getAttribute('aria-label') ||
      svg.getAttribute('aria-labelledby') ||
      svg.getAttribute('title') ||
      svg.querySelector('title');

    if (!hasAccessibleName) {
      // Try to use nearby text or generate one
      const parent = svg.parentElement;
      const nearbyText = parent ? parent.textContent.substring(0, 50) : '';
      const label = nearbyText || 'Decorative icon';
      svg.setAttribute('aria-label', label);
      svg.setAttribute('role', 'img');
    }
  });
  return { valid: issues.length === 0, issues };
}

// Ensures unique landmarks by removing duplicate main elements
export function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first <main> and convert others to <section> or <div>
    for (let i = 1; i < mainElements.length; i++) {
      const extraMain = mainElements[i];
      const section = document.createElement('section');
      section.setAttribute('role', 'region');
      while (extraMain.firstChild) {
        section.appendChild(extraMain.firstChild);
      }
      extraMain.parentNode.replaceChild(section, extraMain);
    }
  }
}

// Fixes fake link issues (e.g., divs/buttons styled as links but not using <a>)
// Replaces fake links with proper anchor elements
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    const href = fakeLink.getAttribute('data-href') || fakeLink.getAttribute('href') || '#';
    const text = fakeLink.textContent;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', href);
    anchor.textContent = text;
    // Copy relevant attributes
    const classes = fakeLink.getAttribute('class');
    if (classes) {
      anchor.setAttribute('class', classes);
    }
    const id = fakeLink.getAttribute('id');
    if (id) {
      anchor.setAttribute('id', id);
    }
    fakeLink.parentNode.replaceChild(anchor, fakeLink);
  );
}

// ... (Preserve the existing code that needs to be preserved)

export { ensureElementHasId, addAriaLabel, setLanguageAttribute };