// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation

import { dependencyGraphContent, indexContent } from './content';

/**
 * Ensures an element has an id attribute, generating one if needed
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Prefix for the generated id
 * @returns {string} The element's id
 */
export function ensureElementHasId(element, prefix = 'element') {
    if (!element.id) {
        element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
}

/**
 * Adds an aria-label attribute to an element for accessibility
 * @param {HTMLElement} element - The element to enhance
 * @param {string} label - The aria-label text
 */
export function addAriaLabel(element, label) {
    if (element && label) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} dependencies - The dependency data to render
 */
export function renderDependencyGraph(container, dependencies) {
    if (!container || !dependencies) return;
    
    const graphContainer = document.createElement('div');
    graphContainer.className = 'dependency-graph';
    graphContainer.setAttribute('role', 'img');
    graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
    
    // Render the graph content
    const graphContent = document.createElement('pre');
    graphContent.textContent = dependencyGraphContent(dependencies);
    graphContainer.appendChild(graphContent);
    
    container.appendChild(graphContainer);
}

/**
 * Ensures element has proper accessibility attributes
 * @param {HTMLElement} element - The element to enhance
 * @param {Object} options - Accessibility options
 * @returns {HTMLElement} The enhanced element
 */
export function enhanceAccessibility(element, options = {}) {
    if (!element) return element;
    
    // Ensure id
    if (options.id) {
        ensureElementHasId(element, options.idPrefix || 'accessible');
    }
    
    // Add aria-label if provided
    if (options.ariaLabel) {
        addAriaLabel(element, options.ariaLabel);
    }
    
    // Add role if provided
    if (options.role) {
        element.setAttribute('role', options.role);
    }
    
    // Add aria-describedby for additional context
    if (options.describedBy) {
        element.setAttribute('aria-describedby', options.describedBy);
    }
    
    return element;
}

// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

// Assuming this is what your main.js might look like before the implementation
// You'll need to integrate this with your actual main.js content

// Existing code would be here...

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

/**
 * Renders a dependency graph visualization for debugging purposes
 * @param {Object} dependencies - Object containing module dependencies
 * @param {string} [format='tree'] - Output format ('tree', 'list', 'json')
 * @returns {string} Formatted dependency graph
 */
export function renderDependencyGraphString(dependencies, format = 'tree') {
  if (!dependencies || typeof dependencies !== 'object') {
    return 'Invalid dependencies object';
  }

  switch (format) {
    case 'tree':
      return renderDependencyTree(dependencies);
    case 'list':
      return renderDependencyList(dependencies);
    case 'json':
      return JSON.stringify(dependencies, null, 2);
    default:
      return 'Unsupported format';
  }
}

/**
 * Helper function to render dependencies in tree format
 * @param {Object} dependencies - Object containing module dependencies
 * @returns {string} Tree-formatted dependency graph
 */
function renderDependencyTree(dependencies) {
  let result = 'Dependency Graph:\n';
  
  function traverse(obj, prefix = '') {
    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      const prefixCurrent = isLast ? '└── ' : '├── ';
      const prefixNext = isLast ? '    ' : '│   ';
      
      result += prefix + prefixCurrent + key + '\n';
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        traverse(obj[key], prefix + prefixNext);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, i) => {
          const isLastItem = i === obj[key].length - 1;
          const itemPrefix = isLastItem ? '└── ' : '├── ';
          result += prefix + prefixNext + itemPrefix + item + '\n';
        });
      } else {
        result += prefix + prefixNext + '└── ' + obj[key] + '\n';
      }
    });
  }
  
  traverse(dependencies);
  return result;
}

/**
 * Helper function to render dependencies in list format
 * @param {Object} dependencies - Object containing module dependencies
 * @returns {string} List-formatted dependency graph
 */
function renderDependencyList(dependencies) {
  let result = 'Dependency List:\n';
  let counter = 1;
  
  function traverse(obj, parentKey = '') {
    const keys = Object.keys(obj);
    keys.forEach(key => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        traverse(obj[key], fullKey);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, index) => {
          const arrayKey = `${fullKey}[${index}]`;
          result += `${counter++}. ${arrayKey}: ${item}\n`;
        });
      } else {
        result += `${counter++}. ${fullKey}: ${obj[key]}\n`;
      }
    });
  }
  
  traverse(dependencies);
  return result;
}

/**
 * Displays the module structure for debugging purposes
 * @param {Object} modules - Object describing module structure
 * @returns {string} Formatted module structure
 */
export function displayModuleStructure(modules) {
  if (!modules || typeof modules !== 'object') {
    return 'Invalid modules object';
  }

  let result = 'Module Structure:\n';
  result += `Total modules: ${Object.keys(modules).length}\n\n`;
  
  Object.keys(modules).forEach((moduleName, index) => {
    const module = modules[moduleName];
    result += `${index + 1}. Module: ${moduleName}\n`;
    
    if (module.description) {
      result += `   Description: ${module.description}\n`;
    }
    
    if (module.version) {
      result += `   Version: ${module.version}\n`;
    }
    
    if (module.dependencies && Array.isArray(module.dependencies)) {
      result += `   Dependencies: ${module.dependencies.join(', ')}\n`;
    }
    
    if (module.exports) {
      result += `   Exports: ${JSON.stringify(module.exports)}\n`;
    }
    
    result += '\n';
  });
  
  return result;
}