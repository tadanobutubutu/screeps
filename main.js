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
        issue.element.setAttribute('role', 'link');
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

function calculateProduct(a, b) {
  return a * b;
}

/**
 * Validates the landmark structure for accessibility issues
 * @param {Document|Element} context - The document or element to validate (defaults to document)
 * @param {Object} options - Validation options
 * @param {boolean} options.requireMain - Require a main landmark (default: true)
 * @param {boolean} options.requireNav - Require at least one nav landmark (default: false)
 * @param {boolean} options.checkHeadingOrder - Check heading hierarchy (default: true)
 * @param {boolean} options.checkMultipleH1 - Check for multiple h1 elements (default: true)
 * @returns {Object} - Validation result with issues and recommendations
 */
function validateLandmarkStructure(context = document, options = {}) {
  const opts = {
    requireMain: true,
    requireNav: false,
    checkHeadingOrder: true,
    checkMultipleH1: true,
    ...options
  };

  const root = context && context.nodeType === 9 ? context.documentElement : (context || document.documentElement);
  
  const result = {
    valid: true,
    issues: [],
    warnings: [],
    landmarks: {
      main: 0,
      nav: 0,
      header: 0,
      footer: 0,
      aside: 0,
      section: 0,
      search: 0,
      form: 0
    },
    headingStructure: [],
    recommendations: []
  };

  // Landmarks that require accessible names
  const namedLandmarks = ['search', 'navigation', 'complementary'];
  
  // Check for various landmarks
  const landmarkTags = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'form'];
  landmarkTags.forEach(tag => {
    const elements = root.getElementsByTagName(tag);
    const key = tag === 'form' ? 'form' : tag;
    result.landmarks[key] = elements.length;
  });

  // Check for search landmark (HTML5 and role-based)
  const searchElements = root.querySelectorAll('[role="search"]');
  result.landmarks.search = searchElements.length;

  // Validate main landmark
  if (opts.requireMain) {
    const mainElements = root.getElementsByTagName('main');
    const mainRole = root.querySelectorAll('[role="main"]');
    
    if (mainElements.length === 0 && mainRole.length === 0) {
      result.valid = false;
      result.issues.push({
        type: 'missing-main-landmark',
        severity: 'error',
        message: 'Page is missing a <main> landmark. Screen reader users may have difficulty finding the primary content.',
        suggestion: 'Add a <main> element or an element with role="main" to contain the primary content.'
      });
    } else if (mainElements.length > 1) {
      result.warnings.push({
        type: 'multiple-main-landmarks',
        severity: 'warning',
        message: `Found ${mainElements.length} <main> elements. Only one should be present per page.`,
        suggestion: 'Ensure only one <main> element exists per page for best accessibility.'
      });
    }
  }

  // Validate nav landmark
  if (opts.requireNav) {
    const navElements = root.getElementsByTagName('nav');
    const navRole = root.querySelectorAll('[role="navigation"]');
    
    if (navElements.length === 0 && navRole.length === 0) {
      result.valid = false;
      result.issues.push({
        type: 'missing-nav-landmark',
        severity: 'error',
        message: 'Page appears to be missing navigation landmarks.',
        suggestion: 'Add <nav> elements with aria-label to identify different navigation regions.'
      });
    }
  }

  // Check for multiple h1 elements
  if (opts.checkMultipleH1) {
    const h1Elements = root.getElementsByTagName('h1');
    if (h1Elements.length > 1) {
      result.warnings.push({
        type: 'multiple-h1',
        severity: 'warning',
        message: `Found ${h1Elements.length} <h1> elements. Best practice is to have exactly one <h1> per page.`,
        suggestion: 'Use a single <h1> for the page title and use lower heading levels (h2-h6) for section headings.'
      });
    }
  }

  // Analyze heading structure
  if (opts.checkHeadingOrder) {
    const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();
      
      result.headingStructure.push({
        level,
        text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        element: heading
      });

      if (previousLevel > 0 && level > previousLevel + 1) {
        result.warnings.push({
          type: 'heading-skip-level',
          severity: 'warning',
          message: `Heading level skipped from h${previousLevel} to h${level}.`,
          suggestion: `Consider adding an h${previousLevel + 1} before h${level} for better document outline.`
        });
      }
      
      previousLevel = level;
    });
  }

  // Check landmarks for accessible names
  const unnamedLandmarks = [];
  namedLandmarks.forEach(role => {
    const elements = root.querySelectorAll(`[role="${role}"]`);
    elements.forEach(el => {
      const hasLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
      if (!hasLabel && el.tagName.toLowerCase() !== 'nav') {
        unnamedLandmarks.push({
          role,
          element: el
        });
      }
    });
  });

  if (unnamedLandmarks.length > 0) {
    result.warnings.push({
      type: 'unnamed-landmarks',
      severity: 'warning',
      message: `Found ${unnamedLandmarks.length} landmark(s) without accessible names.`,
      suggestion: 'Add aria-label or aria-labelledby to landmarks like search and complementary regions.'
    });
  }

  // Generate recommendations
  if (result.valid && result.warnings.length === 0) {
    result.recommendations.push('Landmark structure appears to be accessible.');
  }

  if (result.landmarks.nav > 0 && result.landmarks.nav <= 2) {
    const navs = root.getElementsByTagName('nav');
    let hasLabeledNav = false;
    for (let i = 0; i < navs.length; i++) {
      if (navs[i].getAttribute('aria-label') || navs[i].getAttribute('aria-labelledby')) {
        hasLabeledNav = true;
        break;
      }
    }
    if (!hasLabeledNav) {
      result.recommendations.push('Consider adding aria-label to <nav> elements to describe their purpose (e.g., "Main", "Footer", "Breadcrumb").');
    }
  }

  if (result.headingStructure.length > 0 && result.headingStructure[0].level !== 1) {
    result.recommendations.push('Consider starting your heading structure with an <h1> element for the page title.');
  }

  return result;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addressAccessibilityIssues, calculateSum, calculateProduct, validateLandmarkStructure };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.validateLandmarkStructure = validateLandmarkStructure;
}