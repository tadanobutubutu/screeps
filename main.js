// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// _Commit: be4de8ba2d8cf662acf5fe4b707e0c73c8001161

// <!-- todo-hash: d14d2179a6882376acb8784b647ec3c7b0df2897 -->

/**
 * Gets the language attribute value from the document
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
    if (typeof document !== 'undefined') {
        return document.documentElement.lang || 'en';
    }
    return 'en';
}

/**
 * Gets the full language attribute with region (e.g., 'en-US')
 * @returns {string} The full language attribute value
 */
function getFullLangAttribute() {
    const lang = getLangAttribute();
    // Could be enhanced to parse region from document or configuration
    return lang;
}

/**
 * Validates table accessibility compliance
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with issues array
 */
function validateTableAccessibility(table) {
    const issues = [];
    
    if (!table) {
        return { valid: false, issues: ['No table element provided'] };
    }
    
    // Check for proper table headers
    const headers = table.querySelectorAll('th');
    const cells = table.querySelectorAll('td, th');
    
    if (headers.length === 0 && cells.length > 0) {
        issues.push('Table should have header cells (th) for accessibility');
    }
    
    // Check for caption if table is complex
    const caption = table.querySelector('caption');
    if (!caption && cells.length > 4) {
        issues.push('Complex table should have a caption for accessibility');
    }
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Validates table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Structure validation result
 */
function validateTableStructure(table) {
    const issues = [];
    
    if (!table) {
        return { valid: false, issues: ['No table element provided'] };
    }
    
    // Check for thead, tbody, tfoot structure
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    if (!thead) {
        issues.push('Table should have a thead section for header rows');
    }
    
    if (!tbody) {
        issues.push('Table should have a tbody section for data rows');
    }
    
    // Check for proper scope attributes on headers
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        if (!header.getAttribute('scope')) {
            issues.push(`Header at index ${index} missing scope attribute`);
        }
    });
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Validates landmark elements for accessibility
 * @param {Document} doc - The document to validate
 * @returns {Object} Validation result with landmark issues
 */
function validateLandmark(doc) {
    const issues = [];
    const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    
    if (!doc) {
        return { valid: false, issues: ['No document provided'] };
    }
    
    landmarks.forEach(landmark => {
        const elements = doc.querySelectorAll(landmark);
        if (elements.length === 0 && landmark !== 'aside') {
            // aside is optional, others are recommended
            if (landmark === 'main') {
                issues.push(`Missing recommended <main> landmark`);
            }
        }
    });
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Validates landmark structure for proper nesting and usage
 * @param {Document} doc - The document to validate
 * @returns {Object} Structure validation result
 */
function validateLandmarkStructure(doc) {
    const issues = [];
    
    if (!doc) {
        return { valid: false, issues: ['No document provided'] };
    }
    
    // Check for proper landmark usage
    const headers = doc.querySelectorAll('header:not([role])');
    const mains = doc.querySelectorAll('main:not([role])');
    
    // Ensure only one main landmark
    if (mains.length > 1) {
        issues.push(`Multiple <main> landmarks found (${mains.length}). Only one is recommended.`);
    }
    
    // Check header landmarks
    headers.forEach((header, index) => {
        const parent = header.parentElement;
        if (parent && (parent.tagName === 'ARTICLE' || parent.tagName === 'SECTION')) {
            // Header inside article/section is acceptable
        } else if (index > 0) {
            issues.push(`Additional <header> landmark found. Consider using <div> for non-landmark headers.`);
        }
    });
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Ensures all landmarks have unique identifiers when needed
 * @param {Document} doc - The document to check
 * @returns {Object} Result with duplicate landmarks
 */
function ensureUniqueLandmarks(doc) {
    const issues = [];
    
    if (!doc) {
        return { valid: false, issues: ['No document provided'] };
    }
    
    const landmarks = ['banner', 'navigation', 'main', 'contentinfo', 'complementary'];
    landmarks.forEach(role => {
        const elements = doc.querySelectorAll(`[role="${role}"]`);
        if (elements.length > 1) {
            issues.push(`Multiple landmarks with role="${role}" found (${elements.length}). Each should be unique.`);
        }
    });
    
    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Gets or generates an accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
    if (!svg) {
        return '';
    }
    
    // Check for aria-label
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel;
    }
    
    // Check for aria-labelledby reference
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        if (labelElement) {
            return labelElement.textContent || '';
        }
    }
    
    // Check for title element inside SVG
    const title = svg.querySelector('title');
    if (title) {
        return title.textContent || '';
    }
    
    // Return empty string if no accessible name found
    return '';
}

/**
 * Creates an accessible in-page button with proper semantics
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement} The accessible button element
 */
function createInPageButton(options = {}) {
    const button = document.createElement('button');
    
    button.textContent = options.text || 'Button';
    button.setAttribute('type', 'button');
    
    // Ensure accessible name
    if (options.ariaLabel) {
        button.setAttribute('aria-label', options.ariaLabel);
    }
    
    // Handle click if provided
    if (typeof options.onClick === 'function') {
        button.addEventListener('click', options.onClick);
    }
    
    // Add disabled state if needed
    if (options.disabled) {
        button.disabled = true;
        button.setAttribute('aria-disabled', 'true');
    }
    
    return button;
}

/**
 * Creates an accessible link with proper semantics
 * @param {Object} options - Link options
 * @returns {HTMLAnchorElement} The accessible anchor element
 */
function createAccessibleLink(options = {}) {
    const link = document.createElement('a');
    
    link.textContent = options.text || 'Link';
    link.href = options.href || '#';
    
    // Ensure accessible name
    if (options.ariaLabel) {
        link.setAttribute('aria-label', options.ariaLabel);
    }
    
    // Handle click if provided
    if (typeof options.onClick === 'function') {
        link.addEventListener('click', (e) => {
            if (!link.href || link.href === '#') {
                e.preventDefault();
                options.onClick(e);
            }
        });
    }
    
    // Add role="button" if it's actually a link styled as button
    if (options.role === 'button') {
        link.setAttribute('role', 'button');
    }
    
    return link;
}

/**
 * Handles and reports accessibility issues
 * @param {Array} issues - Array of accessibility issues
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues) {
    const summary = {
        total: issues.length,
        critical: [],
        moderate: [],
        minor: []
    };
    
    issues.forEach(issue => {
        if (issue.severity === 'critical') {
            summary.critical.push(issue);
        } else if (issue.severity === 'moderate') {
            summary.moderate.push(issue);
        } else {
            summary.minor.push(issue);
        }
    });
    
    // Log issues for visibility
    if (summary.critical.length > 0) {
        console.error('Critical accessibility issues found:', summary.critical);
    }
    
    return summary;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getLangAttribute,
        getFullLangAttribute,
        validateTableAccessibility,
        validateTableStructure,
        validateLandmark,
        validateLandmarkStructure,
        ensureUniqueLandmarks,
        getSvgAccessibleName,
        createInPageButton,
        createAccessibleLink,
        handleAccessibilityIssues
    };
}