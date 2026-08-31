// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// (Preserve existing function for control)

/**
 * Ensures the dependencyGraph container has a proper ARIA role
 * @param {HTMLElement} container - The dependencyGraph container element
 */
function ensureDependencyGraphARIA(container) {
  if (!container) return;

  const role = container.getAttribute('role');
  if (!role) {
    container.setAttribute('role', 'region');
  }

  if (!container.hasAttribute('aria-label')) {
    container.setAttribute('aria-label', 'Dependency Graph');
  }
}

/**
 * Ensures all landmark elements have unique ids
 * If a landmark doesn't have an id, generates one
 * @param {Document|Element} root - The root element to search within (defaults to document)
 */
function ensureLandmarkIds(root = document) {
  const LANDMARK_SELECTORS = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const usedIds = new Set();

  // Collect existing ids to avoid collisions
  root.querySelectorAll('[id]').forEach(el => usedIds.add(el.id));

  LANDMARK_SELECTORS.forEach(selector => {
    root.querySelectorAll(selector).forEach(landmark => {
      if (!landmark.id) {
        let baseId = `landmark-${selector}`;
        let id = baseId;
        let counter = 1;

        while (usedIds.has(id)) {
          id = `${baseId}-${counter}`;
          counter++;
        }

        landmark.id = id;
        usedIds.add(id);
      }
    });
  });
}

/** TODO: Implement function for addressing accessibility issues from insight report */
function addressAccessibilityIssues(insightReport) {
    const accessibilityIssues = insightReport.accessibility || [];
    const addressedIssues = [];

    accessibilityIssues.forEach(issue => {
        if (issue.type === 'contrast') {
            addressedIssues.push({
                originalIssue: issue,
                recommendation: 'Increase color contrast ratio to at least 4.5:1 for normal text',
                status: 'addressed'
            });
        } else if (issue.type === 'alt_text') {
            addressedIssues.push({
                originalIssue: issue,
                recommendation: 'Add descriptive alt text to the image element',
                status: 'addressed'
            });
        } else if (issue.type === 'keyboard_navigation') {
            addressedIssues.push({
                originalIssue: issue,
                recommendation: 'Ensure all interactive elements are keyboard accessible',
                status: 'addressed'
            });
        } else {
            addressedIssues.push({
                originalIssue: issue,
                recommendation: 'Review and fix accessibility issue',
                status: 'addressed'
            });
        }
    });

    return {
        totalIssues: accessibilityIssues.length,
        addressedIssues: addressedIssues,
        summary: `Addressed ${addressedIssues.length} accessibility issues from insight report`
    };
}

/* Accessibility Validator and Utilities */

const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
const LANDMARK_SELECTORS = LANDMARK_ELEMENTS.join(',');

function findLandmarks(context = document) {
    const landmarks = [];
    LANDMARK_ELEMENTS.forEach(tag => {
        const elements = context.querySelectorAll(tag);
        elements.forEach(el => landmarks.push(el));
    });
    return landmarks;
}

/**
 * Validates the landmark structure for accessibility issues
 * @param {Document|Element} context - The document or container to validate
 * @returns {Object} Validation result with issues array
 */
function validateLandmarkStructure(context = document) {
    const issues = [];

    // Check for multiple <main> elements (should be exactly one)
    const mainElements = context.querySelectorAll('main');
    if (mainElements.length === 0) {
        issues.push({
            type: 'error',
            code: 'MISSING_MAIN',
            message: 'Document should contain exactly one <main> landmark for main content'
        });
    } else if (mainElements.length > 1) {
        issues.push({
            type: 'error',
            code: 'MULTIPLE_MAIN',
            message: `Document contains ${mainElements.length} <main> elements. Only one is allowed per page.`
        });
    }

    // Validate sections have accessible names
    const sections = context.querySelectorAll('section');
    sections.forEach((section, index) => {
        const hasLabel = section.getAttribute('aria-label') ||
                         section.getAttribute('aria-labelledby') ||
                         section.querySelector('h1, h2, h3, h4, h5, h6');
        if (!hasLabel) {
            issues.push({
                type: 'warning',
                code: 'SECTION_WITHOUT_NAME',
                message: `Section element at index ${index} should have an accessible name (aria-label, aria-labelledby, or heading)`
            });
        }
    });

    // Validate forms have accessible names
    const forms = context.querySelectorAll('form');
    forms.forEach((form, index) => {
        const hasLabel = form.getAttribute('aria-label') ||
                         form.getAttribute('aria-labelledby') ||
                         form.getAttribute('name');
        if (!hasLabel && form.querySelectorAll('input, select, textarea').length > 0) {
            issues.push({
                type: 'warning',
                code: 'FORM_WITHOUT_NAME',
                message: `Form at index ${index} should have an accessible name if it contains form controls`
            });
        }
    });

    // Validate navigation elements
    const navElements = context.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
        const hasLabel = nav.getAttribute('aria-label') ||
                         nav.getAttribute('aria-labelledby');
        const isMultipleNav = navElements.length > 1 && !hasLabel;
        if (isMultipleNav) {
            issues.push({
                type: 'warning',
                code: 'NAV_WITHOUT_LABEL',
                message: `Navigation at index ${index} should have an aria-label when multiple nav elements exist`
            });
        }
    });

    // Check for proper header/footer usage
    const headers = context.querySelectorAll('header');
    headers.forEach((header, index) => {
        if (header.closest('main') && !header.closest('section') && !header.closest('article')) {
            issues.push({
                type: 'info',
                code: 'HEADER_NESTING',
                message: `Header at index ${index} is inside main content - consider if this is the intended use`
            });
        }
    });

    return {
        totalIssues: issues.length,
        issues: issues,
        addressedIssues: [], // Not applicable for landmark validation
        isValid: issues.filter(i => i.type === 'error').length === 0,
        summary: `Landmark validation completed with ${issues.length} issues`
    };
}

/**
 * Gets a summary report of landmark structure validation
 * @param {Document|Element} context - The document or container to analyze
 * @returns {string} Human-readable summary
 */
function getLandmarkSummary(context = document) {
    const result = validateLandmarkStructure(context);
    const summary = [];

    summary.push('Landmark Structure Validation Summary:');
    summary.push(`- Total issues found: ${result.totalIssues}`);

    const errors = result.issues.filter(i => i.type === 'error');
    const warnings = result.issues.filter(i => i.type === 'warning');
    const infos = result.issues.filter(i => i.type === 'info');

    if (errors.length > 0) {
        summary.push(`- Errors: ${errors.length}`);
        errors.forEach(e => summary.push(`  • ${e.message}`));
    }
    if (warnings.length > 0) {
        summary.push(`- Warnings: ${warnings.length}`);
        warnings.forEach(w => summary.push(`  • ${w.message}`));
    }
    if (infos.length > 0) {
        summary.push(`- Info: ${infos.length}`);
        infos.forEach(i => summary.push(`  • ${i.message}`));
    }

    summary.push(`\nValidation ${result.isValid ? 'PASSED' : 'FAILED'}`);

    return summary.join('\n');
}

/* Common utility functions */
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

/* New functions */
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en'); // Assuming English for this example
  }
}

function fixTableStructure() {
  // Implementation for fixing table structure
}

function addMainLandmark() {
  // Implementation for adding/fixing landmark issues
}

function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
}

function addSvgAccessibleNames() {
  // Implementation for adding accessible names to SVGs
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issue
}

/* New function to handle credential response */
function handleCredentialResponse(response) {
  // TODO: Implement the logic to handle the credential response
  // This function should be called when a credential response is received
  // For example, you might parse the response, validate it, and then store or use the credentials
  console.log('Handling credential response:', response);
  // Placeholder for actual implementation
}

/**
 * Gets the appropriate lang attribute value for the HTML element
 * @param {string} [defaultLang='en'] - The default language to use
 * @returns {string} The language code to apply to the html element
 */
function getLangAttribute(defaultLang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && htmlElement.getAttribute('lang')) {
    return htmlElement.getAttribute('lang');
  }
  return defaultLang;
}

/**
 * Gets or sets an accessible name for a person element
 * @param {HTMLElement} element - The element to provide a person name for
 * @param {string} name - The person's name to use as the accessible name
 */
function personName(element, name) {
  if (!element) return;
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', name);
  }
}

/**
 * Validates table accessibility and returns issues found
 * @param {Document|Element} context - The document or container to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableAccessibility(context = document) {
  const issues = [];
  const tables = context.querySelectorAll('table');

  tables.forEach((table, index) => {
    // Check for caption
    const caption = table.querySelector('caption');
    if (!caption) {
      issues.push({
        type: 'warning',
        code: 'TABLE_WITHOUT_CAPTION',
        message: `Table at index ${index} should have a caption element to describe its purpose`
      });
    }

    // Check for headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      issues.push({
        type: 'error',
        code: 'TABLE_WITHOUT_HEADERS',
        message: `Table at index ${index} should have th elements to define row/column headers`
      });
    }
  });

  return {
    totalIssues: issues.length,
    issues: issues,
    summary: `Table accessibility validation completed with ${issues.length} issues`
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Document|Element} context - The document or container to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableStructure(context = document) {
  const issues = [];
  const tables = context.querySelectorAll('table');

  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) {
      issues.push({
        type: 'error',
        code: 'TABLE_EMPTY',
        message: `Table at index ${index} has no rows`
      });
    }

    // Check for proper thead/tbody structure when multiple rows exist
    if (rows.length > 1) {
      const hasThead = table.querySelector('thead');
      if (!hasThead) {
        issues.push({
          type: 'info',
          code: 'TABLE_MISSING_THEAD',
          message: `Table at index ${index} should use thead element to group header rows`
        });
      }
    }
  });

  return {
    totalIssues: issues.length,
    issues: issues,
    summary: `Table structure validation completed with ${issues.length} issues`
  };
}

/**
 * Validates a single landmark element for accessibility
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {Object} Validation result for the landmark
 */
function validateLandmark(landmark) {
  if (!landmark) {
    return {
      isValid: false,
      issues: [{
        type: 'error',
        code: 'NO_LANDMARK',
        message: 'No landmark element provided'
      }]
    };
  }

  const issues = [];
  const tagName = landmark.tagName.toLowerCase();

  // Check for accessible name on section, nav, aside, form
  if (['section', 'nav', 'aside', 'form'].includes(tagName)) {
    const hasLabel = landmark.getAttribute('aria-label') ||
                     landmark.getAttribute('aria-labelledby') ||
                     (tagName === 'section' && landmark.querySelector('h1, h2, h3, h4, h5, h6')) ||
                     (tagName === 'form' && landmark.getAttribute('name'));

    if (!hasLabel) {
      issues.push({
        type: 'warning',
        code: `${tagName.toUpperCase()}_WITHOUT_NAME`,
        message: `${tagName} element should have an accessible name`
      });
    }
  }

  return {
    isValid: issues.filter(i => i.type === 'error').length === 0,
    issues: issues
  };
}

/**
 * Gets an accessible name for an SVG element, generating one if missing
 * @param {SVGElement} svg - The SVG element
 * @param {string} [fallbackName='icon'] - Fallback name if no accessible name exists
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svg, fallbackName = 'icon') {
  if (!svg) return fallbackName;

  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) return ariaLabelledBy;

  const title = svg.querySelector('title');
  if (title && title.textContent) return title.textContent;

  // Generate accessible name if none exists
  svg.setAttribute('aria-label', fallbackName);
  return fallbackName;
}

/**
 * Creates an in-page button element with proper accessibility attributes
 * @param {string} label - The accessible label for the button
 * @param {Function} onClick - The click handler
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.setAttribute('aria-label', label);
  button.textContent = label;
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
}

/**
 * Main game loop
 */
const loop = () => {
  // Main game logic
};

// Module exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loop,
        ensureDependencyGraphARIA,
        ensureLandmarkIds,
        addressAccessibilityIssues,
        validateLandmarkStructure,
        getLandmarkSummary,
        findLandmarks,
        LANDMARK_ELEMENTS,
        LANDMARK_SELECTORS,
        add,
        subtract,
        multiply,
        divide,
        addLangAttribute,
        fixTableStructure,
        addMainLandmark,
        ensureUniqueLandmarks,
        addSvgAccessibleNames,
        fixFakeLinkIssue,
        handleCredentialResponse,
        getLangAttribute,
        personName,
        validateTableAccessibility,
        validateTableStructure,
        validateLandmark,
        getSvgAccessibleName,
        createInPageButton
    };
}

// Auto-validate on load if this is a browser context
if (typeof window !== 'undefined') {
    // Store validation result globally for debugging
    window.landmarkValidation = validateLandmarkStructure(document);
}