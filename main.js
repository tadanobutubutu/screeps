import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language code (e.g., 'en', 'es', 'fr')
 */
function getLangAttribute() {
    // Check for lang attribute on HTML element
    const htmlElement = document.querySelector('html');
    if (htmlElement && htmlElement.lang) {
        return htmlElement.lang;
    }
    
    // Fallback: detect from browser or default to 'en'
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
        return browserLang.split('-')[0];
    }
    
    return 'en';
}

/**
 * Set the language attribute on the HTML element
 * @param {string} lang - The language code to set
 */
function setLanguageAttribute(lang) {
    if (!lang || typeof lang !== 'string') {
        console.warn('Invalid language attribute provided');
        return false;
    }
    
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
        htmlElement.lang = lang;
        return true;
    }
    return false;
}

/**
 * Check if element is a fake link (looks like a link but uses wrong element)
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if element is a fake link
 */
function isFakeLink(element) {
    if (!element) return false;
    
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const onclick = element.getAttribute('onclick');
    const href = element.getAttribute('href');
    
    // It's a fake link if:
    // 1. It's not an anchor but has link-like behavior
    // 2. It has role="link" but isn't an anchor
    // 3. It has onclick but no href and looks like a link
    const isStyledAsLink = window.getComputedStyle(element).cursor === 'pointer';
    
    if (tagName !== 'a' && role === 'link') {
        return true;
    }
    
    if (tagName !== 'a' && onclick && isStyledAsLink && !href) {
        return true;
    }
    
    return false;
}

/**
 * Fix fake links by converting them to proper anchor elements or adding proper href
 * @param {HTMLElement} container - Container element to search within
 * @returns {Object} Object containing count of fixed links and any errors
 */
function fixFakeLinks(container = document) {
    const results = { fixed: 0, errors: [] };
    
    if (!container || !container.querySelectorAll) {
        results.errors.push('Invalid container provided');
        return results;
    }
    
    const fakeLinks = container.querySelectorAll('[role="link"]:not(a), div[onclick], span[onclick]');
    
    fakeLinks.forEach(element => {
        try {
            if (element.getAttribute('role') === 'link' && element.tagName.toLowerCase() !== 'a') {
                // Convert to proper anchor or fix the element
                const href = element.getAttribute('data-href') || '#';
                element.setAttribute('tabindex', '0');
                element.addEventListener('click', () => {
                    if (href !== '#') {
                        window.location.href = href;
                    }
                });
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && href !== '#') {
                        window.location.href = href;
                    }
                });
                results.fixed++;
            }
        } catch (err) {
            results.errors.push(`Error fixing fake link: ${err.message}`);
        }
    });
    
    return results;
}

/**
 * Get accessible name for an SVG element
 * @param {SVGElement} svgElement - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';
    
    // Check aria-label first
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim() !== '') {
        return ariaLabel.trim();
    }
    
    // Check aria-labelledby
    const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        if (labelElement) {
            return labelElement.textContent.trim();
        }
    }
    
    // Check for title element inside SVG
    const title = svgElement.querySelector('title');
    if (title && title.textContent.trim()) {
        return title.textContent.trim();
    }
    
    // Check for desc element inside SVG
    const desc = svgElement.querySelector('desc');
    if (desc && desc.textContent.trim()) {
        return desc.textContent.trim();
    }
    
    return '';
}

/**
 * Validate SVG accessibility
 * @param {SVGElement} svgElement - The SVG element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateSvgAccessibility(svgElement) {
    const errors = [];
    
    if (!svgElement) {
        errors.push('SVG element is required');
        return { valid: false, errors };
    }
    
    // Check if SVG has an accessible name
    const accessibleName = getSvgAccessibleName(svgElement);
    if (!accessibleName) {
        errors.push('SVG must have an accessible name (aria-label, aria-labelledby, title, or desc)');
    }
    
    // Check for decorative SVGs that should have role="presentation" or aria-hidden
    const role = svgElement.getAttribute('role');
    const ariaHidden = svgElement.getAttribute('aria-hidden');
    
    if (!role && !ariaHidden && !accessibleName) {
        errors.push('Decorative SVG should have role="presentation" or aria-hidden="true"');
    }
    
    // Check for interactive SVGs that need proper keyboard support
    const isInteractive = role === 'button' || role === 'link';
    if (isInteractive) {
        const tabIndex = svgElement.getAttribute('tabindex');
        if (tabIndex === null) {
            errors.push('Interactive SVG should have tabindex="0" for keyboard accessibility');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateTableStructure(table) {
    const errors = [];
    
    if (!table) {
        errors.push('Table element is required');
        return { valid: false, errors };
    }
    
    // Check for proper table structure
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    
    if (!thead) {
        errors.push('Table should have a thead element for proper structure');
    }
    
    if (!tbody) {
        errors.push('Table should have a tbody element');
    }
    
    // Check for th elements in thead
    if (thead) {
        const headerCells = thead.querySelectorAll('th');
        const dataCells = thead.querySelectorAll('td');
        
        if (headerCells.length === 0 && dataCells.length > 0) {
            errors.push('Thead should contain th elements for column headers');
        }
        
        // Check for scope attribute on th elements
        headerCells.forEach((th, index) => {
            const scope = th.getAttribute('scope');
            if (!scope) {
                errors.push(`Header cell ${index + 1} should have a scope attribute`);
            }
        });
    }
    
    // Check for caption or summary
    const caption = table.querySelector('caption');
    const summary = table.getAttribute('summary');
    
    if (!caption && !summary) {
        errors.push('Table should have a caption or summary for accessibility');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateTableAccessibility(table) {
    const errors = [];
    
    if (!table) {
        errors.push('Table element is required');
        return { valid: false, errors };
    }
    
    // Run structure validation
    const structureResult = validateTableStructure(table);
    errors.push(...structureResult.errors);
    
    // Check for data tables vs layout tables
    const role = table.getAttribute('role');
    const isLayoutTable = role === 'presentation' || role === 'none';
    
    if (!isLayoutTable) {
        // Data tables should have proper headers
        const ths = table.querySelectorAll('th');
        if (ths.length === 0) {
            errors.push('Data table should have th elements for headers');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate landmark structure
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateLandmarkStructure(element) {
    const errors = [];
    
    if (!element) {
        errors.push('Element is required');
        return { valid: false, errors };
    }
    
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    
    // Valid landmark tags
    const validLandmarkTags = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'form'];
    const validLandmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search', 'form'];
    
    // Check if element is a valid landmark
    const isValidLandmarkTag = validLandmarkTags.includes(tagName);
    const isValidLandmarkRole = role && validLandmarkRoles.includes(role);
    
    if (!isValidLandmarkTag && !is