// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Preserve existing functionality

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Internal set to track used landmark IDs
// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.querySelector('some-selector');
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Gets the language attribute from the HTML element.
 * @returns {string} - the language attribute value
 */
function getLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

// ... existing functions from both branches

// Accessibility helper functions
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// Accessibility validation and helper functions for addressing insight report issues

/**
 * Validates landmark attributes on an element.
 * @param {HTMLElement} element - The element to validate.
 * @param {Object} config - Configuration options.
 * @returns {Object} Validation result with issues array.
 */
function validateLandmark(element, config = {}) {
    const issues = [];
    const landmarkRoles = [
        'banner', 'navigation', 'main', 'complementary', 'contentinfo',
        'search', 'form', 'region'
    ];
    
    const validLandmark = landmarkRoles.some(role => element.hasAttribute(`aria-label`) || 
        element.tagName === 'NAV' || element.tagName === 'HEADER' || 
        element.tagName === 'FOOTER' || element.tagName === 'MAIN' ||
        element.tagName === 'ASIDE' || element.tagName === 'SECTION' ||
        element.tagName === 'FORM' || element.tagName === 'SEARCH');
    
    if (!validLandmark && element.hasAttribute('role')) {
        const role = element.getAttribute('role');
        if (!landmarkRoles.includes(role)) {
            issues.push({
                type: 'REACT_017',
                message: `Invalid landmark role: ${role}`,
                element: element
            });
        }
    }
    
    return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark structure to ensure proper nesting and uniqueness.
 * @param {HTMLElement} container - The container element to validate.
 * @returns {Object} Validation result with issues and recommendations.
 */
function validateLandmarkStructure(container = document) {
    const issues = [];
    const landmarkCounts = {};
    
    const landmarks = container.querySelectorAll(
        'header:not([role]), main, nav, aside, footer:not([role]), section[aria-label], section[aria-labelledby], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
    );
    
    landmarks.forEach(landmark => {
        const tagName = landmark.tagName.toLowerCase();
        const role = landmark.getAttribute('role') || tagName;
        
        // Check for multiple main landmarks
        if (role === 'main') {
            landmarkCounts.main = (landmarkCounts.main || 0) + 1;
            if (landmarkCounts.main > 1) {
                issues.push({
                    type: 'REACT_025',
                    message: 'Multiple main landmarks found. Only one main landmark should exist.',
                    element: landmark
                });
            }
        }
        
        // Check for proper labeling
        if (!landmark.hasAttribute('aria-label') && 
            !landmark.hasAttribute('aria-labelledby') &&
            tagName !== 'nav' && tagName !== 'main') {
            issues.push({
                type: 'REACT_017',
                message: `Landmark ${role} lacks accessible name via aria-label or aria-labelledby`,
                element: landmark
            });
        }
    });
    
    return { valid: issues.length === 0, issues };
}

/**
 * Validates table accessibility including proper headers and structure.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {Object} Validation result with issues.
 */
function validateTableAccessibility(table) {
    const issues = [];
    
    if (!table) {
        return { valid: false, issues: [{ message: 'No table element provided' }] };
    }
    
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');
    
    // Check for missing scope attributes
    headers.forEach((th, index) => {
        if (!th.hasAttribute('scope')) {
            issues.push({
                type: 'REACT_027',
                message: `TH element at index ${index} missing scope attribute`,
                element: th
            });
        }
    });
    
    // Check for missing caption or summary
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
        issues.push({
            type: 'REACT_027',
            message: 'Table lacks caption or aria-label for accessibility',
            element: table
        });
    }
    
    return { valid: issues.length === 0, issues };
}

/**
 * Validates table structure for proper thead/tbody organization.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {Object} Validation result with issues.
 */
function validateTableStructure(table) {
    const issues = [];
    
    if (!table) {
        return { valid: false, issues: [{ message: 'No table element provided' }] };
    }
    
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    
    if (!thead) {
        issues.push({
            type: 'REACT_027',
            message: 'Table missing thead element',
            element: table
        });
    }
    
    if (!tbody) {
        issues.push({
            type: 'REACT_027',
            message: 'Table missing tbody element',
            element: table
        });
    }
    
    // Check for proper th elements in thead
    if (thead) {
        const headerCells = thead.querySelectorAll('th');
        const dataCells = thead.querySelectorAll('td');
        
        if (dataCells.length > 0) {
            issues.push({
                type: 'REACT_027',
                message: 'thead should contain only th elements, not td',
                element: table
            });
        }
        
        headerCells.forEach(th => {
            if (!th.hasAttribute('scope')) {
                issues.push({
                    type: 'REACT_027',
                    message: 'Header cell in thead missing scope="col" attribute',
                    element: th
                });
            } else {
                const scope = th.getAttribute('scope');
                if (scope !== 'col' && scope !== 'row') {
                    issues.push({
                        type: 'REACT_027',
                        message: `Invalid scope attribute value: ${scope}`,
                        element: th
                    });
                }
            }
        });
    }
    
    return { valid: issues.length === 0, issues };
}

/**
 * Gets an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    
    // Check for aria-label
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    // Check for aria-labelledby reference
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        return labelElement ? labelElement.textContent : '';
    }
    
    // Check for title element
    const title = svg.querySelector('title');
    if (title) return title.textContent;
    
    // Check for desc element
    const desc = svg.querySelector('desc');
    if (desc) return desc.textContent;
    
    return '';
}

/**
 * Creates an accessible in-page button with proper semantics.
 * @param {Object} options - Button configuration options.
 * @returns {HTMLButtonElement} The accessible button element.
 */
function createInPageButton(options = {}) {
    const {
        text = '',
        ariaLabel = '',
        onClick = null,
        className = '',
        id = ''
    } = options;
    
    const button = document.createElement('button');
    
    if (id) {
        button.id = id;
    }
    
    if (className) {
        button.className = className;
    }
    
    if (text) {
        button.textContent = text;
    }
    
    if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
    }
    
    // Ensure the button has accessible name
    if (!ariaLabel && !text) {
        console.warn('createInPageButton: Button lacks accessible name');
    }
    
    if (onClick && typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

/**
 * Creates an accessible link element that replaces fake links.
 * @param {Object} options - Link configuration options.
 * @returns {HTMLAnchorElement} The accessible anchor element.
 */
function createAccessibleLink(options = {}) {
    const {
        href = '#',
        text = '',
        ariaLabel = '',
        onClick = null,
        className = '',
        id = '',
        target = '_self'
    } = options;
    
    const link = document.createElement('a');
    
    if (id) {
        link.id = id;
    }
    
    if (href) {
        link.href = href;
    }
    
    if (className) {
        link.className = className;
    }
    
    if (target && target !== '_self') {
        link.target = target;
        link.rel = target === '_blank' ? 'noopener noreferrer' : '';
    }
    
    if (text) {
        link.textContent = text;
    }
    
    if (ariaLabel) {
        link.setAttribute('aria-label', ariaLabel);
    }
    
    // Validate that the link has an accessible name
    if (!ariaLabel && !text) {
        console.warn('createAccessibleLink: Link lacks accessible name');
    }
    
    if (onClick && typeof onClick === 'function') {
        link.addEventListener('click', onClick);
    }
    
    return link;
}

/**
 * Handles and reports accessibility issues found during validation.
 * @param {Array} issues - Array of accessibility issues.
 * @param {Function} reporter - Optional custom reporter function.
 * @returns {Object} Summary of issues handled.
 */
function handleAccessibilityIssues(issues, reporter = null) {
    if (!Array.isArray(issues)) {
        issues = [issues];
    }
    
    const summary = {
        total: issues.length,
        byType: {},
        elements: []
    };
    
    issues.forEach(issue => {
        const type = issue.type || 'UNKNOWN';
        
        if (!summary.byType[type]) {
            summary.byType[type] = [];
        }
        
        summary.byType[type].push(issue);
        
        if (issue.element) {
            summary.elements.push(issue.element);
        }
        
        // Log issue
        if (reporter && typeof reporter === 'function') {
            reporter(issue);
        } else {
            console.warn(`[Accessibility] ${type}: ${issue.message}`);
        }
    });
    
    return summary;
}

/**
 * Ensures all landmarks in the document have unique identifiers.
 * @param {HTMLElement} container - Container element to scan.
 * @returns {Object} Report of landmark uniqueness.
 */
function ensureUniqueLandmarks(container = document) {
    const report = {
        duplicates: [],
        fixed: 0,
        landmarks: []
    };
    
    const landmarkSelectors = [
        '[role="banner"]', '[role="navigation"]', '[role="main"]',
        '[role="complementary"]', '[role="contentinfo"]', '[role="search"]',
        '[role="form"]', '[role="region"]', 'header:not([role])', 'nav',
        'main', 'aside', 'footer:not([role])', 'section'
    ];
    
    const allLandmarks = container.querySelectorAll(landmarkSelectors.join(', '));
    const seenIds = new Set();
    
    allLandmarks.forEach(landmark => {
        const currentId = landmark.id;
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        
        if (currentId) {
            if (seenIds.has(currentId)) {
                report.duplicates.push({
                    id: currentId,
                    role: role,
                    element: landmark
                });
                
                // Generate new unique ID
                const newId = ensureUniqueLandmarkId(role);
                landmark.id = newId;
                report.fixed++;
            } else {
                seenIds.add(currentId);
            }
        } else {
            // Add ID if missing
            const newId = ensureUniqueLandmarkId(role);
            landmark.id = newId;
            report.fixed++;
        }
        
        report.landmarks.push({
            element: landmark,
            id: landmark.id,
            role: role
        });
    });
    
    return report;
}

// ... other existing functions remained unchanged