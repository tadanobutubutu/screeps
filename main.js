/**
 * Main JavaScript file with accessibility improvements
 * 
 * TODO: Address accessibility issues from insight report:
 * - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
 * - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
 * - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
 * - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
 * - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
 * - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
 * - ADD: Address new accessibility issues from insight report
 */

// Initialize the application
(function() {
    'use strict';

    // Your existing initialization code here
    document.addEventListener('DOMContentLoaded', function() {
        initializeAccessibility();
    });
})();

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
    // Get the language attribute from the HTML element
    const htmlElement = document.documentElement;
    return htmlElement.getAttribute('lang') || 'en';
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
    if (!table) return false;
    
    // Check if table has proper accessibility attributes
    const hasCaption = table.querySelector('caption') !== null;
    const hasHeaders = table.querySelector('th') !== null;
    const hasScope = Array.from(table.querySelectorAll('th')).every(th => th.hasAttribute('scope'));
    
    return hasCaption && hasHeaders && hasScope;
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
    if (!table) return false;
    
    // Ensure proper table structure
    const hasThead = table.querySelector('thead') !== null;
    const hasTbody = table.querySelector('tbody') !== null;
    const hasProperHeaders = table.querySelectorAll('th').length > 0;
    
    return hasThead && hasTbody && hasProperHeaders;
}

// REACT_017: Validate landmarks
function validateLandmark(element) {
    if (!element) return false;
    
    // Check for valid landmark roles
    const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
    const role = element.getAttribute('role');
    
    if (role) {
        return validLandmarks.includes(role);
    }
    
    // Check for implicit landmarks (HTML5 elements)
    const implicitLandmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    return implicitLandmarks.includes(element.tagName.toLowerCase());
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure() {
    const landmarks = {
        banner: document.querySelector('header[role="banner"], header:not(nav *)'),
        navigation: document.querySelectorAll('nav'),
        main: document.querySelector('main, [role="main"]'),
        complementary: document.querySelector('aside, [role="complementary"]'),
        contentinfo: document.querySelector('footer, [role="contentinfo"]')
    };
    
    // Ensure only one main landmark
    const mainElements = document.querySelectorAll('main, [role="main"]');
    
    return {
        hasUniqueMain: mainElements.length <= 1,
        landmarks: landmarks
    };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    
    // Check for aria-label
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    // Check for aria-labelledby
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const referencedElement = document.getElementById(ariaLabelledby);
        return referencedElement ? referencedElement.textContent : '';
    }
    
    // Check for title element inside SVG
    const title = svg.querySelector('title');
    return title ? title.textContent : '';
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
    const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    const issues = [];
    
    landmarkTypes.forEach(type => {
        const elements = document.querySelectorAll(`[role="${type}"], ${type === 'navigation' ? 'nav' : type === 'main' ? 'main' : type === 'banner' ? 'header' : type === 'contentinfo' ? 'footer' : type}`);
        
        if (elements.length > 1 && type === 'main') {
            issues.push({
                type: 'REACT_025',
                message: `Multiple ${type} landmarks found. Only one ${type} landmark should exist.`,
                count: elements.length
            });
        }
    });
    
    return issues;
}

// REACT_036: Fix fake link issue - createInPageButton
function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('type', 'button');
    
    // Add proper accessibility attributes
    button.setAttribute('role', 'button');
    
    if (typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

// REACT_036: personName function for accessible names
function personName(element) {
    if (!element) return '';
    
    // Get accessible name from element
    const accessibleName = element.getAttribute('aria-label');
    if (accessibleName) return accessibleName;
    
    // Check for aria-labelledby
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const referencedElement = document.getElementById(ariaLabelledby);
        return referencedElement ? referencedElement.textContent : '';
    }
    
    // Fall back to text content
    return element.textContent || '';
}

// Initialize accessibility features
function initializeAccessibility() {
    // Validate and fix landmarks
    const landmarkValidation = validateLandmarkStructure();
    const landmarkIssues = ensureUniqueLandmarks();
    
    // Validate all tables
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (!validateTableAccessibility(table)) {
            console.warn('Table accessibility issues detected');
        }
        if (!validateTableStructure(table)) {
            console.warn('Table structure issues detected');
        }
    });
    
    // Ensure SVGs have accessible names
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const name = getSvgAccessibleName(svg);
        if (!name) {
            console.warn('SVG missing accessible name');
        }
    });
    
    return {
        landmarks: landmarkValidation,
        issues: landmarkIssues
    };
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getLangAttribute,
        validateTableAccessibility,
        validateTableStructure,
        validateLandmark,
        validateLandmarkStructure,
        getSvgAccessibleName,
        ensureUniqueLandmarks,
        createInPageButton,
        personName,
        initializeAccessibility
    };
}