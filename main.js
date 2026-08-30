// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;
  
  const summary = {
    totalIssues: issues.length,
    linkIssuesFixed: 0,
    buttonIssuesFixed: 0,
    skipped: 0,
    fixes: []
  };

  issues.forEach((issue) => {
    if (!issue.element || !issue.element.parentNode) {
      summary.skipped++;
      return;
    }

    try {
      if (issue.type === 'link') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.linkIssuesFixed++;
        summary.fixes.push({
          type: 'link',
          index: issue.index,
          action: 'Added accessible text content'
        });
      } else if (issue.type === 'button') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.buttonIssuesFixed++;
        summary.fixes.push({
          type: 'button',
          index: issue.index,
          action: 'Added accessible name'
        });
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue.type,
        index: issue.index,
        action: 'Failed to fix',
        error: error.message
      });
    }
  });

  return summary;
}

/**
 * Analyzes accessibility issues from an insight report
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @returns {Object} - Analysis results with prioritized fixes
 */
function analyzeAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return { error: 'Invalid insight report', addressedIssues: [] };
  }

  const addressedIssues = [];
  const recommendations = [];

  insightReport.issues.forEach((issue) => {
    const addressedIssue = {
      id: issue.id,
      type: issue.type,
      element: issue.element,
      severity: issue.severity || 'low',
      fixed: true,
      recommendation: getRecommendationForIssue(issue.type)
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
function getRecommendationForIssue(issueType) {
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
function fixReactSvgAccessibleName(svgString) {
  // Check if the SVG string already contains an accessible name
  if (svgString.includes('aria-label') || svgString.includes('aria-labelledby') || svgString.includes('aria-describedby')) {
    return svgString;
  }

  // Create a temporary SVG element to parse the SVG string
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgRoot = doc.documentElement;

  // Check if the SVG is decorative and does not need an accessible name
  const isDecorative = svgRoot.closest('button, input, textarea, select, audio[controls], video[controls]');
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

// Example data structure
const DEFAULT_CONFIG = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
};

const version = "1.0.0";

function addressAccessibilityIssuesFromReport(report) {
  if (!report) return;
  report.forEach(issue => {
    switch (issue.type) {
      case 'missing-lang':
        if (issue.element && !issue.element.getAttribute('lang')) {
          issue.element.setAttribute('lang', 'en');
        }
        break;
      case 'missing-skip-link':
        if (issue.element) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        document.querySelectorAll('input, select, textarea').forEach(el => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
    }
  });
}

function ensureUniqueLandmarks() {
  const landmarkSelectors = [
    'main',
    '[role="banner"]',
    '[role="header"]',
    'nav',
    '[role="navigation"]',
    'aside',
    '[role="complementary"]',
    'footer',
    '[role="contentinfo"]'
  ];
  
  const landmarkElements = document.querySelectorAll(landmarkSelectors.join(', '));
  const ids = new Set();
  
  landmarkElements.forEach(el => {
    if (el.id) {
      if (ids.has(el.id)) {
        console.warn('Duplicate ID found for landmark:', el.id);
      } else {
        ids.add(el.id);
      }
    }
  });
  
  return ids;
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  mainElement = document.createElement('main');

  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  document.body.appendChild(mainElement);

  return mainElement;
}

const mainElement = document.querySelector('main');
if (!mainElement) {
  mainElement = wrapPrimaryContentInMain();
}

if (mainElement && !mainElement.getAttribute('lang')) {
  mainElement.setAttribute('lang', 'en');
}

function ensureMainHasId() {
  // Implementation for ensuring unique landmarks
  const main = document.querySelector('main');
  if (main) {
    main.id = 'main';
  }
}

function addAccessibleNamesToSVGs() {
  // Implementation for adding accessible names to SVGs
}

function fixFakeLinks() {
  // Implementation for fixing fake link issues
}

function fixLandmarkIssues() {
  // Implementation for fixing landmark issues
}

function calculateProduct(a, b) {
  return a * b;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addressAccessibilityIssues,
    analyzeAccessibilityIssues,
    getRecommendationForIssue,
    fixReactSvgAccessibleName,
    generateSummary,
    addressAccessibilityIssuesFromReport,
    ensureUniqueLandmarks,
    wrapPrimaryContentInMain,
    calculateSum,
    calculateProduct
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.analyzeAccessibilityIssues = analyzeAccessibilityIssues;
  window.getRecommendationForIssue = getRecommendationForIssue;
  window.fixReactSvgAccessibleName = fixReactSvgAccessibleName;
  window.generateSummary = generateSummary;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
}