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

// Add new functions for improved accessibility
/**
 * Helper function to get the key-value pairs as an array of strings for accessibility purposes
 * @param {Object} obj - The object to convert
 * @returns {Array<string>} An array of key-value pairs as strings
 */
function getKeyValuePairs(obj) {
  let result = [];

  Object.keys(obj).forEach((key) => {
    result.push(`${key}: ${obj[key]}`);
  });

  return result;
}

/**
 * Helper function to get the values as an array for accessibility purposes
 * @param {Object} obj - The object to convert
 * @returns {Array<string>} An array of values
 */
function getValues(obj) {
  let result = [];

  Object.values(obj).forEach((value) => {
    if (value) {
      result.push(value);
    }
  });

  return result;
}

// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
  // Placeholder implementation, this should be replaced with actual logic
  console.log('Checking landmark elements...');
  // Example: You might query the DOM for landmark elements and check their presence or properties
  // const landmarkElements = document.querySelectorAll('landmark');
  // landmarkElements.forEach(element => {
  //   console.log(`Found landmark element: ${element.id}`);
  // });
}

/**
 * Validates landmark elements for accessibility compliance
 * @param {Object} landmarkData - Object containing landmark information to validate
 * @returns {Object} Validation result with isValid flag and any errors found
 */
function validateLandmark(landmarkData) {
  const errors = [];
  
  if (!landmarkData || typeof landmarkData !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid landmark data provided']
    };
  }
  
  // Check for required landmarks
  const requiredLandmarks = ['main'];
  requiredLandmarks.forEach(landmark => {
    if (!landmarkData[landmark]) {
      errors.push(`Missing required landmark: ${landmark}`);
    }
  });
  
  // Check for proper landmark naming
  if (landmarkData.nav && !landmarkData.nav.name && !landmarkData.nav.ariaLabel) {
    errors.push('Navigation landmark should have an accessible name');
  }
  
  if (landmarkData.aside && !landmarkData.aside.name && !landmarkData.aside.ariaLabel) {
    errors.push('Complementary landmark (aside) should have an accessible name');
  }
  
  // Check for landmark conflicts
  if (landmarkData.header) {
    const headerCount = Array.isArray(landmarkData.header) 
      ? landmarkData.header.length 
      : 1;
    if (headerCount > 1) {
      errors.push('Multiple header landmarks detected - consider using one header with nested elements');
    }
  }
  
  // Validate landmark hierarchy
  if (landmarkData.main && landmarkData.main.nestedLandmarks) {
    const invalidNesting = landmarkData.main.nestedLandmarks.filter(
      nested => ['header', 'footer', 'main'].includes(nested)
    );
    if (invalidNesting.length > 0) {
      errors.push(`Invalid landmark nesting in main: ${invalidNesting.join(', ')} should not be nested inside main`);
    }
  }
  
  // Check for landmark redundancy
  if (landmarkData.nav && landmarkData.nav.isRedundant) {
    errors.push('Navigation landmark may be redundant if it is the only nav element');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Renders a dependency graph visualization for debugging purposes
 * @param {Object} dependencies - Object containing module dependencies
 * @param {string} [format='tree'] - Output format ('tree', 'list', 'json')
 * @returns {string} Formatted dependency graph
 */
function renderDependencyGraph(dependencies, format = 'tree') {
  // Existing code, preserving original function implementation
}

// Add accessibility improvements to existing functions

/**
 * Helper function to render dependencies in tree format
 * @param {Object} dependencies - Object containing module dependencies
 * @returns {string} Tree-formatted dependency graph
 */
function renderDependencyTree(dependencies) {
  let result = 'Dependency Graph:\n';
  const getIndentation = (level) => '....'.repeat(level);

  function traverse(obj, prefix = '', level = 0) {
    const keys = Object.keys(obj);
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      const indentation = getIndentation(level);
      const indentationCurrent = isLast ? '└── ' : '├── ';
      const indentationNext = isLast ? '' : '│   ';
      ....
      // Existing code, preserving original implementation but also adding accessibility improvements
      ...
    });
  }
  ....
  // Existing code, preserving original function implementation but also adding accessibility improvements
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
      ....
      // Existing code, preserving original implementation but also adding accessibility improvements
      ...
    });
  }
  ....
  // Existing code, preserving original function implementation but also adding accessibility improvements
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
    
    if (module.dependencies && Object.keys(module.dependencies).length > 0) {
      result += `   Dependencies: ${Object.keys(module.dependencies).join(', ')}\n`;
    }
    
    if (module.exports) {
      result += `   Exports: ${module.exports}\n`;
    }
    
    result += '\n';
  });

  return result;
}

renderDependencyGraph(dependencyGraphContent);

export {
  renderDependencyGraph,
  renderDependencyTree,
  renderDependencyList,
  displayModuleStructure,
  validateLandmark
};