import { dependencyGraphContent, indexContent } from './content';

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

// Assuming this is what your main.js might look like before the implementation
// You'll need to integrate this with your actual main.js content

// Existing code would be here...

/**
 * Checks for landmark elements in HTML content for accessibility purposes
 * Landmark elements help screen readers navigate the page structure
 * @param {string} htmlContent - HTML content to check for landmark elements
 * @returns {Object} Object containing found landmarks and any missing required landmarks
 */
function checkLandmarkElements(htmlContent) {
  const landmarkElements = ['header', 'main', 'nav', 'footer', 'aside', 'section', 'article'];
  const result = {
    found: [],
    missing: [],
    hasMainElement: false,
    hasHeaderElement: false,
    hasNavElement: false,
    hasFooterElement: false
  };

  if (!htmlContent || typeof htmlContent !== 'string') {
    return { error: 'Invalid HTML content provided' };
  }

  const lowerContent = htmlContent.toLowerCase();

  landmarkElements.forEach(element => {
    const regex = new RegExp(`<${element}[\\s>]`, 'i');
    if (regex.test(lowerContent)) {
      result.found.push(element);
      
      switch (element) {
        case 'main':
          result.hasMainElement = true;
          break;
        case 'header':
          result.hasHeaderElement = true;
          break;
        case 'nav':
          result.hasNavElement = true;
          break;
        case 'footer':
          result.hasFooterElement = true;
          break;
      }
    }
  });

  // Check for required landmarks (at least one main element is required for accessibility)
  if (!result.hasMainElement) {
    result.missing.push('main');
  }

  // Check for proper header usage (should not be used inside main)
  const headerInMainRegex = /<main[^>]*>[\s\S]*?<header/gi;
  if (headerInMainRegex.test(lowerContent)) {
    result.accessibilityWarning = 'Header element should not be placed directly inside main element';
  }

  // Check for multiple nav elements and their purposes
  const navMatches = lowerContent.match(/<nav[^>]*>/gi) || [];
  if (navMatches.length > 1) {
    result.multipleNavs = true;
    result.warning = 'Multiple nav elements detected. Ensure each has an appropriate aria-label';
  }

  return result;
}

/**
 * Validates landmark element structure for WCAG compliance
 * @param {string} htmlContent - HTML content to validate
 * @returns {Object} Validation results with accessibility score
 */
function validateLandmarkStructure(htmlContent) {
  const checkResult = checkLandmarkElements(htmlContent);
  
  let score = 100;
  const issues = [];

  if (!checkResult.hasMainElement) {
    score -= 40;
    issues.push('Missing main landmark element');
  }

  if (!checkResult.hasHeaderElement) {
    score -= 10;
    issues.push('Missing header landmark element');
  }

  if (!checkResult.hasNavElement) {
    score -= 15;
    issues.push('Missing nav landmark element');
  }

  if (!checkResult.hasFooterElement) {
    score -= 10;
    issues.push('Missing footer landmark element');
  }

  if (checkResult.accessibilityWarning) {
    score -= 15;
    issues.push(checkResult.accessibilityWarning);
  }

  if (checkResult.multipleNavs && !checkResult.warning.includes('aria-label')) {
    score -= 10;
    issues.push(checkResult.warning);
  }

  return {
    score: Math.max(0, score),
    passed: score >= 70,
    issues: issues,
    landmarks: checkResult.found
  };
}

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
    
    if (module.dependencies && module.dependencies.length) {
      result += `   Dependencies: ${module.dependencies.join(', ')}\n`;
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
  checkLandmarkElements,
  validateLandmarkStructure
};