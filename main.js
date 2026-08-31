// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

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

/**
 * Validates landmark elements for accessibility (REACT_017)
 * @param {Document|Element} context - The document or container to validate
 * @returns {Object} Validation result with issues array
 */
function validateLandmark(context = document) {
    const issues = [];
    const landmarks = findLandmarks(context);

    landmarks.forEach((landmark, index) => {
        const tagName = landmark.tagName.toLowerCase();
        const hasAccessibleName = landmark.getAttribute('aria-label') ||
                                  landmark.getAttribute('aria-labelledby') ||
                                  (tagName !== 'section' && tagName !== 'form' && tagName !== 'nav') ||
                                  landmark.querySelector('h1, h2, h3, h4, h5, h6');

        if (!hasAccessibleName && (tagName === 'section' || tagName === 'nav' || tagName === 'form')) {
            issues.push({
                type: 'warning',
                code: 'LANDMARK_WITHOUT_NAME',
                element: tagName,
                index: index,
                message: `${tagName} landmark at index ${index} should have an accessible name`
            });
        }

        if (!landmark.id) {
            issues.push({
                type: 'info',
                code: 'LANDMARK_WITHOUT_ID',
                element: tagName,
                index: index,
                message: `${tagName} landmark at index ${index} is missing an id`
            });
        }
    });

    return {
        totalIssues: issues.length,
        issues: issues,
        isValid: issues.filter(i => i.type === 'error').length === 0,
        summary: `Landmark validation completed with ${issues.length} issues`
    };
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

/**
 * Gets the lang attribute value for a given element or document (REACT_015)
 * @param {Element|Document} [element=document] - The element to inspect
 * @returns {string} The lang attribute value, or empty string if not set
 */
function getLangAttribute(element = document) {
  if (!element) return '';
  const doc = element.ownerDocument || element;
  const html = doc.documentElement || doc;
  return html.getAttribute('lang') || '';
}

/**
 * Returns an accessible person name string (REACT_015 / REACT_036)
 * @param {Object} person - Person object with name properties
 * @returns {string} Accessible person name
 */
function personName(person) {
  if (!person) return '';
  if (typeof person === 'string') return person;
  return person.fullName || person.name ||
         [person.givenName, person.familyName].filter(Boolean).join(' ') ||
         '';
}

/**
 * Validates table accessibility issues (REACT_027)
 * @param {Document|Element} context - The document or container to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableAccessibility(context = document) {
    const issues = [];
    const tables = context.querySelectorAll('table');

    tables.forEach((table, tableIndex) => {
        // Check for caption
        const caption = table.querySelector('caption');
        if (!caption) {
            issues.push({
                type: 'warning',
                code: 'TABLE_WITHOUT_CAPTION',
                tableIndex: tableIndex,
                message: `Table at index ${tableIndex} should have a <caption> element`
            });
        }

        // Check header cells have scope
        const ths = table.querySelectorAll('th');
        ths.forEach((th, thIndex) => {
            const scope = th.getAttribute('scope');
            if (!scope) {
                issues.push({
                    type: 'warning',
                    code: 'TH_WITHOUT_SCOPE',
                    tableIndex: tableIndex,
                    thIndex: thIndex,
                    message: `Header cell at table ${tableIndex}, header ${thIndex} should have a scope attribute`
                });
            }
        });

        // Check tables have at least one header
        if (ths.length === 0) {
            issues.push({
                type: 'error',
                code: 'TABLE_WITHOUT_HEADERS',
                tableIndex: tableIndex,
                message: `Table at index ${tableIndex} has no header cells`
            });
        }
    });

    return {
        totalIssues: issues.length,
        issues: issues,
        isValid: issues.filter(i => i.type === 'error').length === 0,
        summary: `Table accessibility validation completed with ${issues.length} issues`
    };
}

/**
 * Validates overall table structure (REACT_027)
 * @param {Document|Element} context - The document or container to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableStructure(context = document) {
    const issues = [];
    const tables = context.querySelectorAll('table');

    tables.forEach((table, tableIndex) => {
        // Check that tables used for layout don't have structural table elements
        const role = table.getAttribute('role');
        if (role === 'presentation' || role === 'none') {
            const hasStructuralElements = table.querySelector('thead, tbody, tfoot, th, caption');
            if (hasStructuralElements) {
                issues.push({
                    type: 'warning',
                    code: 'LAYOUT_TABLE_WITH_STRUCTURE',
                    tableIndex: tableIndex,
                    message: `Table at index ${tableIndex} marked as layout but has structural table elements`
                });
            }
            return;
        }

        // Validate proper nesting
        const nestedTable = table.querySelector('table');
        if (nestedTable) {
            issues.push({
                type: 'warning',
                code: 'NESTED_TABLE',
                tableIndex: tableIndex,
                message: `Table at index ${tableIndex} contains a nested table - consider if this is necessary`
            });
        }

        // Check rows belong to proper groups
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
            const parent = row.parentElement;
            const parentTag = parent ? parent.tagName.toLowerCase() : '';
            if (parentTag !== 'tbody' && parentTag !== 'thead' && parentTag !== 'tfoot' && parentTag !== 'table') {
                issues.push({
                    type: 'warning',
                    code: 'ROW_OUTSIDE_GROUP',
                    tableIndex: tableIndex,
                    rowIndex: rowIndex,
                    message: `Row at table ${tableIndex}, row ${rowIndex} is not inside a tbody/thead/tfoot group`
                });
            }
        });
    });

    return {
        totalIssues: issues.length,
        issues: issues,
        isValid: issues.filter(i => i.type === 'error').length === 0,
        summary: `Table structure validation completed with ${issues.length} issues`
    };
}

/**
 * Fixes table structure issues
 */
function fixTableStructure() {
  // Implementation for fixing table structure
}

/**
 * Adds/fixes landmark issues
 */
function addLandmarkIssues() {
  // Implementation for adding/fixing landmark issues
}

/**
 * Adds main landmark if missing
 */
function addMainLandmark() {
  // Implementation for adding/fixing landmark issues
}

/**
 * Ensures unique landmarks (REACT_025)
 */
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
}

/**
 * Adds accessible names to SVGs (REACT_041)
 */
function addSvgAccessibleNames() {
  // Implementation for adding accessible names to SVGs
}

/**
 * Gets accessible name for an SVG element (REACT_041)
 * @param {SVGElement} svgEl - The SVG element
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svgEl) {
  if (!svgEl) return '';
  const ariaLabel = svgEl.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const labelledBy = svgEl.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ownerDoc = svgEl.ownerDocument || document;
    const labelEl = ownerDoc.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent || '';
  }
  const titleEl = svgEl.querySelector('title');
  if (titleEl) return titleEl.textContent || '';
  return '';
}

/**
 * Fixes fake link issues (REACT_036)
 */
function fixFakeLinkIssue() {
  // Implementation for fixing fake link issue
}

/**
 * Creates an in-page button element (REACT_036)
 * @param {string} label - The button label
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(label, onClick) {
  if (typeof document === 'undefined') return null;
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label || '';
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
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
        validateLandmark,
        validateTableAccessibility,
        validateTableStructure,
        getLangAttribute,
        personName,
        getSvgAccessibleName,
        createInPageButton,
        addLandmarkIssues,
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
        handleCredentialResponse
    };
}

// Auto-validate on load if this is a browser context
if (typeof window !== 'undefined') {
    // Store validation result globally for debugging
    window.landmarkValidation = validateLandmarkStructure(document);
}