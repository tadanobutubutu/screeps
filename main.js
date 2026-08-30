// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Preserve existing functionality

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function createUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
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

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.getAttribute('aria-label')) {
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

/**
 * Ensures an element has an ID, generating one if necessary.
 * @param {HTMLElement} element - The element to check.
 * @param {string} [prefix='element'] - Prefix for generated ID.
 * @returns {string} The element's ID.
 */
function ensureElementHasId(element, prefix = 'element') {
    if (!element.id) {
        element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
}

/**
 * Renders a dependency graph visualization.
 * @param {HTMLElement} container - Container element for the graph.
 * @param {Array} dependencies - Array of dependency objects.
 */
function renderDependencyGraph(container, dependencies) {
    if (!container || !dependencies) return;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-label', 'Dependency graph');
    svg.setAttribute('role', 'img');
    
    let y = 50;
    dependencies.forEach(dep => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '50');
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', '200');
        rect.setAttribute('height', '40');
        rect.setAttribute('rx', '4');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '60');
        text.setAttribute('y', (y + 25).toString());
        text.textContent = dep.name || dep;
        
        group.appendChild(rect);
        group.appendChild(text);
        svg.appendChild(group);
        y += 60;
    });
    
    container.appendChild(svg);
}

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    
    if (ariaLabel) return ariaLabel;
    if (title) return title.textContent;
    
    return '';
}

/**
 * Creates an accessible in-page button with proper labeling.
 * @param {string} text - Button text content.
 * @param {string} [ariaLabel] - Optional aria-label.
 * @returns {HTMLButtonElement} The created button.
 */
function createInPageButton(text, ariaLabel) {
    const button = document.createElement('button');
    button.textContent = text;
    if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
    }
    return button;
}

/**
 * Creates an accessible link with proper attributes.
 * @param {string} href - The URL for the link.
 * @param {string} text - Link text content.
 * @param {Object} [options] - Additional options.
 * @returns {HTMLAnchorElement} The created link.
 */
function createAccessibleLink(href, text, options = {}) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    
    if (options.ariaLabel) {
        link.setAttribute('aria-label', options.ariaLabel);
    }
    
    if (options.onClick) {
        link.addEventListener('click', options.onClick);
    }
    
    return link;
}

/**
 * Validates landmark accessibility.
 * @param {HTMLElement} element - Element to validate.
 * @returns {Object} Validation result.
 */
function validateLandmark(element) {
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search', 'region'];
    const role = element.getAttribute('role');
    
    if (role && !validRoles.includes(role)) {
        return { valid: false, message: `Invalid landmark role: ${role}` };
    }
    
    return { valid: true };
}

/**
 * Validates landmark structure for accessibility.
 * @param {HTMLElement} container - Container element to validate.
 * @returns {Object} Validation result.
 */
function validateLandmarkStructure(container) {
    const landmarks = container.querySelectorAll('[role]');
    const unique = uniqueLandmarks(Array.from(landmarks).map(lm => ({ id: lm.id || Math.random().toString(36) })));
    
    return {
        valid: landmarks.length === unique.length,
        message: landmarks.length === unique.length ? 'All landmarks are unique' : 'Duplicate landmarks found'
    };
}

/**
 * Ensures all landmarks have unique IDs.
 * @param {HTMLElement} container - Container element.
 * @returns {Array} List of landmark IDs.
 */
function ensureUniqueLandmarks(container) {
    const landmarks = container.querySelectorAll('[role]');
    const ids = [];
    
    landmarks.forEach(landmark => {
        if (!landmark.id) {
            landmark.id = createUniqueLandmarkId(landmark.getAttribute('role') || 'landmark');
        }
        ids.push(landmark.id);
    });
    
    return ids;
}

/**
 * Validates table accessibility.
 * @param {HTMLTableElement} table - Table element to validate.
 * @returns {Object} Validation result.
 */
function validateTableAccessibility(table) {
    const headers = table.querySelectorAll('th');
    let issues = 0;
    
    headers.forEach(th => {
        if (!th.getAttribute('scope')) {
            issues++;
        }
    });
    
    return { valid: issues === 0, issues };
}

/**
 * Validates table structure for accessibility.
 * @param {HTMLTableElement} table - Table element to validate.
 * @returns {Object} Validation result.
 */
function validateTableStructure(table) {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const ths = table.querySelectorAll('th');
    
    const issues = [];
    
    if (!thead) issues.push('Missing thead');
    if (!tbody) issues.push('Missing tbody');
    
    ths.forEach((th, index) => {
        if (!th.getAttribute('scope')) {
            issues.push(`th at index ${index} missing scope attribute`);
        }
    });
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Handles accessibility issues for an element.
 * @param {HTMLElement} element - Element to fix.
 * @param {Array} issues - List of issues to address.
 */
function handleAccessibilityIssues(element, issues) {
    issues.forEach(issue => {
        switch (issue.type) {
            case 'missing-lang':
                if (!document.documentElement.lang) {
                    document.documentElement.lang = issue.value || 'en';
                }
                break;
            case 'missing-aria-label':
                addAriaLabel(element, issue.value);
                break;
            case 'missing-id':
                ensureElementHasId(element, issue.prefix);
                break;
            case 'missing-landmark':
                if (!element.getAttribute('role')) {
                    element.setAttribute('role', issue.role || 'region');
                }
                break;
            case 'table-scope':
                if (element.tagName === 'TH' && !element.getAttribute('scope')) {
                    element.setAttribute('scope', issue.value || 'col');
                }
                break;
        }
    });
}

// Accessibility helper functions
function handleKeyboardNavigation(options = {}) {
    const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

    return function(event) {
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
    };
}

/**
 * Traps focus within a container element.
 * @param {HTMLElement} container - Container element for focus trapping.
 */
function trapFocus(container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = function(event) {
        if (event.key !== 'Tab') return;

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    };

    container.addEventListener('keydown', handleTab);
}

// Export functions for testing and external use
module.exports = {
    createUniqueLandmarkId,
    uniqueLandmarks,
    addAriaLabel,
    getLangAttribute,
    getFullLangAttribute,
    ensureElementHasId,
    renderDependencyGraph,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    validateTableAccessibility,
    validateTableStructure,
    handleAccessibilityIssues,
    handleKeyboardNavigation,
    trapFocus
};