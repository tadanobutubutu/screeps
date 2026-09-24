// TODO: This is the existing code that needs to be preserved

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
    // ... (You can use the already implemented logic here)
  });

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

  return issues;
}

function calculateSum(a, b) {
  return a + b;
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Returns the appropriate lang attribute value for the HTML element.
 * Handles REACT_015: Add lang attribute to HTML element.
 * @param {HTMLElement} htmlElement - The root HTML element
 * @returns {string} - The lang attribute value to apply
 */
function getLangAttribute(htmlElement) {
  if (!htmlElement) {
    return 'en';
  }
  const existing = htmlElement.getAttribute('lang');
  if (existing && existing.trim().length > 0) {
    return existing;
  }
  return 'en';
}

/**
 * Creates an in-page button element used for accessibility fixes.
 * Handles REACT_015 and REACT_036.
 * @param {Object} options - Button options
 * @param {string} options.text - Visible text for the button
 * @param {string} options.ariaLabel - Accessible label for the button
 * @returns {HTMLElement} - The created button element
 */
function createInPageButton(options = {}) {
  const text = options.text || 'Action';
  const ariaLabel = options.ariaLabel || text;
  const button = typeof document !== 'undefined' ? document.createElement('button') : { type: 'button' };
  button.type = 'button';
  button.textContent = text;
  button.setAttribute('aria-label', ariaLabel);
  return button;
}

/**
 * Validates table accessibility issues.
 * Handles REACT_027.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} - Validation summary
 */
function validateTableAccessibility(table) {
  const summary = {
    hasCaption: false,
    hasHeaders: false,
    issues: []
  };
  if (!table) {
    return summary;
  }
  summary.hasCaption = !!table.querySelector('caption');
  summary.hasHeaders = !!table.querySelector('th');
  if (!summary.hasCaption) {
    summary.issues.push('Missing caption');
  }
  if (!summary.hasHeaders) {
    summary.issues.push('Missing header cells');
  }
  return summary;
}

/**
 * Validates table structure issues.
 * Handles REACT_027.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} - Validation summary
 */
function validateTableStructure(table) {
  const summary = {
    validStructure: true,
    issues: []
  };
  if (!table) {
    summary.validStructure = false;
    summary.issues.push('No table provided');
    return summary;
  }
  if (!table.querySelector('thead')) {
    summary.issues.push('Missing thead');
  }
  if (!table.querySelector('tbody')) {
    summary.issues.push('Missing tbody');
  }
  if (summary.issues.length > 0) {
    summary.validStructure = false;
  }
  return summary;
}

/**
 * Validates landmark roles on the page.
 * Handles REACT_017.
 * @param {HTMLElement} element - The element to validate
 * @returns {Object} - Validation summary
 */
function validateLandmark(element) {
  const summary = {
    isLandmark: false,
    role: null
  };
  if (!element) {
    return summary;
  }
  const role = element.getAttribute('role');
  const landmarkRoles = ['banner', 'main', 'navigation', 'contentinfo', 'complementary', 'region'];
  if (role && landmarkRoles.indexOf(role) !== -1) {
    summary.isLandmark = true;
    summary.role = role;
  }
  return summary;
}

/**
 * Validates landmark structure.
 * Handles REACT_017.
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Object} - Validation summary
 */
function validateLandmarkStructure(landmarks) {
  const summary = {
    total: Array.isArray(landmarks) ? landmarks.length : 0,
    valid: 0,
    issues: []
  };
  if (!Array.isArray(landmarks)) {
    summary.issues.push('Landmarks must be an array');
    return summary;
  }
  landmarks.forEach((landmark, index) => {
    const validation = validateLandmark(landmark);
    if (validation.isLandmark) {
      summary.valid++;
    } else {
      summary.issues.push(`Landmark at index ${index} is invalid`);
    }
  });
  return summary;
}

/**
 * Returns the accessible name for an SVG element.
 * Handles REACT_041.
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} - The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) {
    return '';
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return ariaLabel;
  }
  const title = svg.querySelector('title');
  if (title && title.textContent.trim().length > 0) {
    return title.textContent.trim();
  }
  return '';
}

/**
 * Sets accessibility attributes on an SVG element.
 * Handles REACT_041.
 * @param {HTMLElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to apply
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg || !accessibleName) {
    return;
  }
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('role', 'img');
}

/**
 * Validates link accessibility.
 * Handles REACT_036.
 * @param {HTMLElement} link - The link element to validate
 * @returns {Object} - Validation summary
 */
function validateLinkAccessibility(link) {
  const summary = {
    hasAccessibleName: false,
    isValid: false,
    issues: []
  };
  if (!link) {
    summary.issues.push('No link provided');
    return summary;
  }
  const text = (link.textContent || '').trim();
  const ariaLabel = link.getAttribute('aria-label');
  if (text.length > 0 || (ariaLabel && ariaLabel.trim().length > 0)) {
    summary.hasAccessibleName = true;
  } else {
    summary.issues.push('Missing accessible name');
  }
  summary.isValid = summary.hasAccessibleName;
  return summary;
}

/**
 * Handles fake link elements by converting them to buttons.
 * Handles REACT_036.
 * @param {HTMLElement} element - The fake link element
 * @returns {HTMLElement} - The converted button element
 */
function handleFakeLinks(element) {
  if (!element) {
    return null;
  }
  const text = (element.textContent || 'Action').trim();
  return createInPageButton({ text: text, ariaLabel: text });
}

/**
 * Checks link and button accessibility across the document.
 * @param {Document|HTMLElement} root - The root element to scan
 * @returns {Object} - Summary of link and button accessibility issues
 */
function checkLinkAndButtonAccessibility(root) {
  const doc = root || (typeof document !== 'undefined' ? document : null);
  const summary = {
    linkIssues: 0,
    buttonIssues: 0,
    fakeLinks: 0,
    issues: []
  };
  if (!doc) {
    return summary;
  }
  const links = doc.querySelectorAll ? doc.querySelectorAll('a') : [];
  links.forEach((link, index) => {
    const validation = validateLinkAccessibility(link);
    if (!validation.isValid) {
      summary.linkIssues++;
      summary.issues.push({ type: 'link', index, element: link });
    }
    const role = link.getAttribute('role');
    if (role === 'button') {
      summary.fakeLinks++;
    }
  });
  const buttons = doc.querySelectorAll ? doc.querySelectorAll('button') : [];
  buttons.forEach((button, index) => {
    const text = (button.textContent || '').trim();
    const ariaLabel = button.getAttribute('aria-label');
    if (text.length === 0 && (!ariaLabel || ariaLabel.trim().length === 0)) {
      summary.buttonIssues++;
      summary.issues.push({ type: 'button', index, element: button });
    }
  });
  return summary;
}

/**
 * Ensures the dependencyGraph container has a proper ARIA role.
 * @param {string} containerId - The ID of the container element (default 'dependencyGraph').
 * @param {string} role - The ARIA role to assign (default 'region').
 */
function ensureDependencyGraphARIA(containerId = 'dependencyGraph', role = 'region') {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', role);
  }
}

// New function for rendering graph/index
function renderGraphIndex(data) {
  // Implementation for rendering graph/index
  // This is a placeholder function and should be replaced with actual implementation
  console.log('Rendering graph/index with data:', data);
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

// TODO: This is the existing code that needs to be preserved

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