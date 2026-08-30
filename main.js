import { dependencyGraphContent, indexContent } from './content';

/**
 * Validates an ARIA landmark element for accessibility compliance
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {Object} Validation result containing isValid boolean and errors array
 */
function validateLandmark(element) {
  const errors = [];

  if (!element || !(element instanceof HTMLElement)) {
    return { isValid: false, errors: ['Element is not a valid HTMLElement'] };
  }

  const tagName = element.tagName.toLowerCase();
  const validLandmarkTags = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'form'];
  const validAriaRoles = [
    'banner', 'navigation', 'main', 'complementary', 'contentinfo',
    'region', 'form', 'search', 'dialog', 'application'
  ];

  const role = element.getAttribute('role');
  const hasLandmarkTag = validLandmarkTags.includes(tagName);
  const hasLandmarkRole = role && validAriaRoles.includes(role.toLowerCase());

  if (!hasLandmarkTag && !hasLandmarkRole) {
    errors.push(`Element <${tagName}> is not a recognized landmark element and has no valid role attribute`);
  }

  // Check for accessible label on landmarks that require it
  if (hasLandmarkRole || ['section', 'form'].includes(tagName)) {
    const accessibleName =
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      (tagName === 'form' ? element.querySelector('label, legend') : null);

    if (!accessibleName) {
      errors.push(`Landmark <${tagName}> requires an accessible name (aria-label, aria-labelledby, or title attribute)`);
    }
  }

  // Check for duplicate landmarks without distinguishing labels
  const landmarkType = role || tagName;
  const sameTypeLandmarks = Array.from(document.querySelectorAll(`[role="${landmarkType}"], ${tagName}[role="${landmarkType}"], ${tagName}`))
    .filter(el => (el.getAttribute('role') || el.tagName.toLowerCase()) === landmarkType);

  if (sameTypeLandmarks.length > 1 && landmarkType !== 'main') {
    const hasUniqueness =
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('title');

    if (!hasUniqueness) {
      errors.push(`Multiple landmarks of type "${landmarkType}" found; each should have a unique accessible name`);
    }
  }

  // Check for empty landmarks
  if (element.children.length === 0 && !element.textContent.trim()) {
    errors.push(`Landmark <${tagName}> is empty`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

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
  validateLandmark
};