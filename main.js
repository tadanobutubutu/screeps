import { dependencyGraphContent, indexContent } from './content';

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

/**
 * Creates an in-page button element with proper accessibility attributes
 * @param {string} text - Button text/label
 * @param {Function} onClick - Click event handler
 * @param {Object} [options={}] - Additional button options
 * @param {string} [options.type='button'] - Button type ('button', 'submit', 'reset')
 * @param {string} [options.className] - CSS class name(s) for styling
 * @param {string} [options.id] - Button ID attribute
 * @param {boolean} [options.disabled=false] - Whether button is initially disabled
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  
  // Set button type (default to 'button')
  button.type = options.type || 'button';
  
  // Set button text/label
  button.textContent = text;
  
  // Set click handler
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Set CSS class if provided
  if (options.className) {
    button.className = options.className;
  }
  
  // Set ID if provided
  if (options.id) {
    button.id = options.id;
  }
  
  // Set disabled state if provided
  if (options.disabled) {
    button.disabled = true;
  }
  
  // Add accessibility attributes
  button.setAttribute('aria-label', options['aria-label'] || text);
  
  // Ensure keyboard accessibility
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.click();
    }
  });
  
  return button;
}

// Assuming this is what your main.js might look like before the implementation
// You'll need to integrate this with your actual main.js content

// Existing code would be here...

/**
 * Renders a dependency graph visualization for debugging purposes
 * @param {Object} dependencies - Object containing module dependencies
 * @param {string} [format='tree'] - Output format ('tree', 'list', 'json')
 * @returns {string} Formatted dependency graph
 */
function renderDependencyGraph(dependencies, format = 'tree') {
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
function displayModuleStructure(modules) {
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

renderDependencyGraph(dependencyGraphContent);
displayModuleStructure(indexContent);

export {
  renderDependencyGraph,
  renderDependencyTree,
  renderDependencyList,
  displayModuleStructure,
  createInPageButton
};