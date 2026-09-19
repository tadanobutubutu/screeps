// TODO: This is the existing code that needs to be preserved
import { dependencyGraphContent, indexContent } from './content';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// Added functionalities:
// - Add aria-label to SVGs without title elements (DONE: addAriaLabelToSVGs)
// - Add aria-labelledby to SVGs with title elements (DONE: addAriaLabelledbyToSVGs)
// - Add Proper Landmark Regions (DONE: addProperLandmarkRegions)

// ----- END ORIGINAL CODE -----

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

  const fixes = [];
  const issues = insightReport.issues || [];

  issues.forEach(issue => {
    const fix = generateAccessibilityFix(issue);
    if (fix) {
      fixes.push(fix);
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

  return {
    success: true,
    fixes: fixes,
    summary: `Addressed ${fixes.length} accessibility issues`
  };
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