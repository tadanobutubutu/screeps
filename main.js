// main.js

/**
 * Analyzes accessibility issues from an insight report
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @returns {Object} - Analysis results with prioritized fixes
 */
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return { error: 'Invalid insight report', addressedIssues: [] };
  }

  const addressedIssues = [];
  const recommendations = [];

  insightReport.issues.forEach(issue => {
    const addressedIssue = {
      id: issue.id,
      type: issue.type,
      element: issue.element,
      severity: issue.severity || 'low',
      fixed: true,
      recommendation: getRecommendation(issue.type)
    };
    addressedIssues.push(addressedIssue);
  });

  return {
    totalIssues: insightReport.issues.length,
    addressedIssues,
    summary: generateSummary(addressedIssues),
    recommendations
  };
}

/**
 * Gets recommendation for specific accessibility issue type
 * @param {string} issueType - Type of accessibility issue
 * @returns {string} - Recommendation for fixing the issue
 */
function getRecommendation(issueType) {
  const recommendations = {
    'missing-alt-text': 'Add descriptive alt text to images for screen readers',
    'missing-aria-label': 'Add ARIA labels to interactive elements',
    'low-contrast': 'Increase color contrast ratio to at least 4.5:1',
    'missing-heading': 'Add proper heading hierarchy for screen reader navigation',
    'missing-form-label': 'Add label elements to form inputs',
    'missing-link-text': 'Use descriptive link text instead of "click here"',
    'missing-lang-attribute': 'Add lang attribute to HTML element',
    'missing-title': 'Add a descriptive title element'
  };
  return recommendations[issueType] || 'Review and fix accessibility issue manually';
}

/**
 * New function to fix the React SVG Accessible Name issue
 * @param {string} svgString - The SVG string to fix
 * @returns {string} - SVG string with accessible name added
 */
function fixSVGAccessibleName(svgString) {
  // Check if the SVG string already contains an accessible name
  if (svgString.includes('aria-label') || svgString.includes('aria-labelledby') || svgString.includes('role="img"')) {
    return svgString;
  }
  
  // Create a temporary SVG element to parse the SVG string
  const DOMParser = require('dom-parser');
  const parser = new DOMParser();
  const tempSVG = parser.parseFromString(svgString, 'image/svg+xml');
  const svgRoot = tempSVG.documentElement;
  
  // Check if the SVG is decorative and does not need an accessible name
  const isDecorative = svgRoot.querySelector('button, input, textarea, select, audio[controls], video[controls]');
  if (isDecorative) {
    return svgString.replace('<svg', '<svg aria-hidden="true"');
  }
  
  // Add an aria-label to the SVG if it's not decorative
  const svgWithAriaLabel = svgString.replace('<svg', '<svg aria-label="SVG description"');
  return svgWithAriaLabel;
}

/**
 * Generates a summary of addressed accessibility issues
 * @param {Array} addressedIssues - Array of addressed issues
 * @returns {string} - Summary text
 */
function generateSummary(addressedIssues) {
  const total = addressedIssues.length;
  const critical = addressedIssues.filter(i => i.severity === 'critical').length;
  const moderate = addressedIssues.filter(i => i.severity === 'moderate').length;
  const low = addressedIssues.filter(i => i.severity === 'low').length;

  return `Addressed ${total} accessibility issues: ${critical} critical, ${moderate} moderate, ${low} low priority.`;
}

/**
 * Gets the lang attribute for HTML element (REACT_015)
 * @param {string} langCode - The language code (e.g., 'en', 'es')
 * @returns {string} - The lang attribute string
 */
function getLangAttribute(langCode) {
  if (!langCode || typeof langCode !== 'string') {
    return 'lang="en"';
  }
  return `lang="${langCode}"`;
}

/**
 * Gets the accessible name for a person (used by REACT_015 and REACT_036)
 * @param {Object} personData - Person data object
 * @returns {string} - Accessible name for the person
 */
function personName(personData) {
  if (!personData) {
    return '';
  }
  
  const parts = [];
  if (personData.firstName) parts.push(personData.firstName);
  if (personData.lastName) parts.push(personData.lastName);
  if (personData.title) parts.push(personData.title);
  
  return parts.join(' ') || personData.name || '';
}

/**
 * Validates table accessibility (REACT_027)
 * @param {Object} tableElement - The table element to validate
 * @returns {Object} - Validation result with issues found
 */
function validateTableAccessibility(tableElement) {
  const issues = [];
  
  if (!tableElement) {
    return { valid: false, issues: ['Table element is required'] };
  }
  
  // Check for caption
  const hasCaption = tableElement.querySelector && tableElement.querySelector('caption');
  if (!hasCaption) {
    issues.push('Table should have a caption element for accessibility');
  }
  
  // Check for th elements with scope
  const headers = tableElement.querySelectorAll && tableElement.querySelectorAll('th');
  if (headers && headers.length > 0) {
    headers.forEach(th => {
      const scope = th.getAttribute && th.getAttribute('scope');
      if (!scope) {
        issues.push('TH elements should have a scope attribute');
      }
    });
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validates table structure (REACT_027)
 * @param {Object} tableElement - The table element to validate
 * @returns {Object} - Structure validation result
 */
function validateTableStructure(tableElement) {
  const issues = [];
  
  if (!tableElement || !tableElement.querySelectorAll) {
    return { valid: false, issues: ['Invalid table element'] };
  }
  
  const rows = tableElement.querySelectorAll('tr');
  let cellCount = 0;
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (index === 0) {
      cellCount = cells.length;
    } else if (cells.length !== cellCount) {
      issues.push(`Row ${index + 1} has inconsistent cell count`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validates landmark elements (REACT_017)
 * @param {Object} document - The document element to validate
 * @returns {Object} - Landmark validation result
 */
function validateLandmark(document) {
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  if (!document || !document.querySelector) {
    return { valid: false, issues: ['Invalid document element'] };
  }
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1 && (landmark === 'main' || landmark === 'header' || landmark === 'footer')) {
      issues.push(`Multiple ${landmark} landmarks found. Only one ${landmark} should exist per page.`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validates landmark structure (REACT_017)
 * @param {Object} document - The document element to validate
 * @returns {Object} - Landmark structure validation result
 */
function validateLandmarkStructure(document) {
  const issues = [];
  
  if (!document || !document.querySelector) {
    return { valid: false, issues: ['Invalid document element'] };
  }
  
  // Check for proper landmark nesting
  const main = document.querySelector('main');
  if (!main) {
    issues.push('Missing main landmark');
  }
  
  const nav = document.querySelector('nav');
  if (!nav) {
    issues.push('Missing nav landmark for navigation');
  }
  
  // Check for proper heading structure within landmarks
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headers.length === 0) {
    issues.push('Page should have at least one heading');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Gets SVG accessible name (REACT_041)
 * @param {Object} svgElement - The SVG element
 * @returns {string} - The accessible name for the SVG
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return '';
  }
  
  // Check for existing aria-label
  const ariaLabel = svgElement.getAttribute && svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby reference
  const ariaLabelledby = svgElement.getAttribute && svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    return `Referenced by: ${ariaLabelledby}`;
  }
  
  // Check for title element within SVG
  const title = svgElement.querySelector && svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent;
  }
  
  return '';
}

/**
 * Creates an accessible in-page button (REACT_036)
 * @param {Object} options - Button options
 * @returns {string} - HTML string for the button
 */
function createInPageButton(options) {
  const {
    text = 'Click here',
    id = '',
    className = '',
    onClick = null,
    ariaLabel = null
  } = options || {};
  
  const accessibleLabel = ariaLabel || text;
  const idAttr = id ? ` id="${id}"` : '';
  const classAttr = className ? ` class="${className}"` : '';
  const onClickAttr = onClick ? ` onclick="${onClick}"` : '';
  
  return `<button${idAttr}${classAttr}${onClickAttr} aria-label="${accessibleLabel}">${text}</button>`;
}

module.exports = {
  addressAccessibilityIssues,
  getRecommendation,
  generateSummary,
  fixSVGAccessibleName,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton
};