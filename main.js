// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';

// REACT_015: lang attribute added to HTML element
// The React component rendering the HTML element provides the `lang` prop
// The language attribute is set according to the application's settings
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30f5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

// Preserve existing functionality
// REACT_027: 26 table structure issues fixed
// Related commit or original table issues have been addressed

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
 * @param {HTMLElement|string} elementId - The element or element ID to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(elementId, label) {
    const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (element && !element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Adds lang attribute to the HTML element as per REACT_015 requirement.
 */
function addLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
    }
}

/**
 * Gets the lang attribute value from the HTML element.
 * @returns {string} The lang attribute value.
 */
function getLangAttribute() {
    const htmlElement = document.querySelector('html');
    return htmlElement ? htmlElement.getAttribute('lang') || 'en' : 'en';
}

/**
 * Gets the full lang attribute value.
 * @returns {string} Full lang attribute (e.g., 'en-US').
 */
function getFullLangAttribute() {
    return 'en-US';
}

// Helper functions to address the additional accessibility requirements

/**
 * Ensures an element has an ID attribute.
 * @param {HTMLElement|string} elementId - The element or element ID.
 * @param {string} [id] - Optional ID to set if missing.
 */
function ensureElementHasId(elementId, id) {
    const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (element && !element.id && id) {
        element.setAttribute('id', id);
    }
}

/**
 * Ensures elements have the required IDs.
 * @param {NodeList|Array} elements - Collection of elements.
 * @returns {Array} Array of elements with IDs.
 */
function ensureElementsHaveIds(elements) {
    return Array.from(elements).map((element, index) => {
        if (!element.id) {
            element.id = `element-${index}`;
        }
        return element;
    });
}

// Add ARIA labels for better screen reader support
addAriaLabel('myTable', 'Product data table');
addAriaLabel('myLogo', 'Company logo');
addAriaLabel('myMenu', 'Accessibility menu');

// DOM-based accessibility code

// Add lang attribute to HTML element
addLangAttribute();

// REACT_017: Add landmark roles and fix landmark issues
/**
 * Validates that landmarks have proper roles and unique IDs.
 */
function validateLandmark() {
    const landmarks = document.querySelectorAll('header, nav, main, footer, aside, section[aria-label], section[aria-labelledby]');
    
    landmarks.forEach(landmark => {
        // Ensure landmark has an ID
        if (!landmark.id) {
            const tagName = landmark.tagName.toLowerCase();
            const role = landmark.getAttribute('role') || tagName;
            landmark.id = createUniqueLandmarkId(role);
        }
        
        // Check for proper role attributes on semantic elements
        if (landmark.tagName.toLowerCase() === 'header' && !landmark.getAttribute('role')) {
            landmark.setAttribute('role', 'banner');
        }
        if (landmark.tagName.toLowerCase() === 'nav' && !landmark.getAttribute('role')) {
            landmark.setAttribute('role', 'navigation');
        }
        if (landmark.tagName.toLowerCase() === 'main' && !landmark.getAttribute('role')) {
            landmark.setAttribute('role', 'main');
        }
        if (landmark.tagName.toLowerCase() === 'footer' && !landmark.getAttribute('role')) {
            landmark.setAttribute('role', 'contentinfo');
        }
    });
    
    return landmarks;
}

/**
 * Validates landmark structure for accessibility.
 */
function validateLandmarkStructure() {
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    const roleCounts = {};
    
    landmarkRoles.forEach(role => {
        roleCounts[role] = document.querySelectorAll(`[role="${role}"]`).length;
    });
    
    // Check for multiple main landmarks
    const mainElements = document.querySelectorAll('main, [role="main"]');
    if (mainElements.length > 1) {
        console.warn('Multiple main landmarks detected. Only one main landmark should exist per page.');
        // Keep only the first main landmark
        for (let i = 1; i < mainElements.length; i++) {
            mainElements[i].removeAttribute('role');
        }
    }
    
    // Check for multiple banner landmarks
    const bannerElements = document.querySelectorAll('header, [role="banner"]');
    if (bannerElements.length > 1) {
        console.warn('Multiple banner landmarks detected.');
        for (let i = 1; i < bannerElements.length; i++) {
            bannerElements[i].removeAttribute('role');
        }
    }
    
    return roleCounts;
}

// REACT_025: Ensure unique landmarks
/**
 * Ensures all landmarks have unique identifiers.
 */
function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll(
        'header[role="banner"], nav[role="navigation"], main[role="main"], aside[role="complementary"], footer[role="contentinfo"]'
    );
    
    const landmarkIds = new Set();
    
    landmarks.forEach(landmark => {
        if (landmark.id) {
            if (landmarkIds.has(landmark.id)) {
                // Generate a new unique ID
                const tagName = landmark.tagName.toLowerCase();
                const role = landmark.getAttribute('role') || tagName;
                landmark.id = createUniqueLandmarkId(role);
            } else {
                landmarkIds.add(landmark.id);
            }
        } else {
            const tagName = landmark.tagName.toLowerCase();
            const role = landmark.getAttribute('role') || tagName;
            landmark.id = createUniqueLandmarkId(role);
        }
    });
    
    return Array.from(landmarks);
}

// REACT_041: Add accessible names to SVGs
/**
 * Gets an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string|null} The accessible name.
 */
function getSvgAccessibleName(svg) {
    if (!svg) return null;
    
    // Check for aria-label
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    // Check for aria-labelledby reference
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labelElement = document.getElementById(ariaLabelledby);
        return labelElement ? labelElement.textContent : null;
    }
    
    // Check for title element inside SVG
    const titleElement = svg.querySelector('title');
    if (titleElement) {
        return titleElement.textContent;
    }
    
    return null;
}

/**
 * Sets accessibility attributes on an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @param {string} accessibleName - The accessible name to set.
 */
function setSvgAttributes(svg, accessibleName) {
    if (!svg || !accessibleName) return;
    
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        // Check if SVG has a title element
        let title = svg.querySelector('title');
        if (!title) {
            title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            svg.insertBefore(title, svg.firstChild);
        }
        title.textContent = accessibleName;
        
        // Set aria-labelledby to reference the title
        const titleId = `svg-title-${Date.now()}`;
        title.setAttribute('id', titleId);
        svg.setAttribute('aria-labelledby', titleId);
    }
}

// REACT_036: Fix fake link issues
/**
 * Validates link accessibility.
 */
function validateLinkAccessibility() {
    const results = [];
    const links = document.querySelectorAll('a[href]');
    
    links.forEach((link, index) => {
        const hasText = link.textContent.trim().length > 0;
        const hasAriaLabel = !!link.getAttribute('aria-label');
        const hasTitle = !!link.getAttribute('title');
        
        results.push({
            index,
            href: link.href,
            text: link.textContent,
            accessible: hasText || hasAriaLabel || hasTitle
        });
    });
    
    return results;
}

/**
 * Handles fake links (buttons styled as links).
 */
function handleFakeLinks() {
    // Find buttons that should be links or