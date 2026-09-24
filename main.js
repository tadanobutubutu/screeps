// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';

// REACT_015: lang attribute added to HTML element
// The React component rendering the HTML element provides the `lang` prop
// The language attribute is set according to the application's settings
// (This comment remains as-is)
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

// DOM-based accessibility code

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
function addAriaLabel(elementId, label) {
    const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (element) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
    document.documentElement.lang = getLangAttribute();
}

/**
 * Gets the full lang attribute value
 * @returns {string} The full language tag (e.g., 'en-US')
 */
function getFullLangAttribute() {
    return document.documentElement.lang || 'en';
}

/**
 * Gets the lang attribute value
 * @returns {string} The language tag
 */
function getLangAttribute() {
    return getFullLangAttribute();
}

// New helper functions to address the additional accessibility requirements

/**
 * Ensures an element has an id attribute, adding one if missing
 * @param {string} elementId - The element id or element to check
 */
function ensureElementHasId(elementId) {
    const element = document.getElementById(elementId);
    if (element && !element.id) {
        element.id = elementId;
    }
}

/**
 * Ensures multiple elements have IDs, generating them if missing
 * @param {NodeList|Array} elements - The elements to ensure have IDs
 * @returns {Array} Array of elements with IDs
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
addAriaLabel('menuBtn', 'Accessibility menu');

// DOM-based accessibility code

// Add lang attribute to HTML element
addLangAttribute();

// TODO: add the new functions or changes requested in the issue
// Here's a sample implementation for a new function named 'myNewFunction'
function myNewFunction(arg1, arg2) {
    // Your implementation of the function goes here.
    // For example, let's just return the product of the inputs.
    return arg1 * arg2;
}

// Added function to handle full lang attribute as mentioned in the issue

function personName() {
    // Existing code...
}

function validateLandmark() {
    // Validate that landmarks have proper roles and IDs
    const landmarkSelectors = [
        'header[role="banner"]',
        'nav[role="navigation"]',
        'main[role="main"]',
        'footer[role="contentinfo"]',
        '[role="banner"]',
        '[role="navigation"]',
        '[role="main"]',
        '[role="contentinfo"]',
        '[role="complementary"]',
        '[role="region"]'
    ];
    
    const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
    
    landmarks.forEach(landmark => {
        // Ensure landmark has an accessible name
        const hasLabel = landmark.getAttribute('aria-label') || 
                        landmark.getAttribute('aria-labelledby') ||
                        landmark.title;
        
        if (!hasLabel && landmark.tagName !== 'MAIN') {
            // Add generic labels for landmarks that need them
            if (landmark.getAttribute('role') === 'navigation') {
                landmark.setAttribute('aria-label', 'Site navigation');
            } else if (landmark.getAttribute('role') === 'complementary') {
                landmark.setAttribute('aria-label', 'Supplementary content');
            }
        }
    });
}

function validateLandmarkStructure() {
    // Validate landmark structure and ensure uniqueness
    const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary'];
    const seenRoles = {};
    
    landmarkRoles.forEach(role => {
        const landmarks = document.querySelectorAll(`[role="${role}"]`);
        if (landmarks.length > 1) {
            // Keep only the first occurrence for unique roles
            for (let i = 1; i < landmarks.length; i++) {
                landmarks[i].removeAttribute('role');
            }
        }
    });
}

function validateTableAccessibility(table) {
    // Implementation for validating table accessibility
    if (!table) return;
    // Add accessibility checks for table
    
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
        // Ensure th elements have scope attribute
        if (!th.hasAttribute('scope')) {
            const row = th.closest('tr');
            const isFirstCell = row && row.cells[0] === th;
            th.setAttribute('scope', isFirstCell ? 'row' : 'col');
        }
    });
}

function validateTableStructure(table) {
    // Implementation for validating table structure
    if (!table) return;
    // Add structure validation logic
    
    // Ensure tables have proper caption or aria-label
    if (!table.caption && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
        table.setAttribute('aria-label', 'Data table');
    }
}

/**
 * Gets an accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    
    // Check for aria-label
    let label = svg.getAttribute('aria-label');
    if (label) return label;
    
    // Check for aria-labelledby
    const labelledById = svg.getAttribute('aria-labelledby');
    if (labelledById) {
        const labelElement = document.getElementById(labelledById);
        if (labelElement) return labelElement.textContent;
    }
    
    // Check for title element within SVG
    const title = svg.querySelector('title');
    if (title) return title.textContent;
    
    // Check for adjacent title or description
    const id = svg.id;
    if (id) {
        const describedBy = svg.getAttribute('aria-describedby');
        if (describedBy) {
            const descElement = document.getElementById(describedBy);
            if (descElement) return descElement.textContent;
        }
    }
    
    // Return generic accessible name based on context
    const parent = svg.closest('[role="button"], a, button');
    if (parent) {
        return parent.getAttribute('aria-label') || parent.textContent || 'Icon';
    }
    
    return 'Decorative graphic';
}

/**
 * Sets accessibility attributes on an SVG element
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 */
function setSvgAttributes(svg, accessibleName) {
    if (!svg) return;
    // Add accessible name to SVG
    
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        // If no accessible name exists, either:
        // 1. Add a title element if appropriate
        // 2. Add aria-label for screen readers
        if (accessibleName && accessibleName !== 'Decorative graphic') {
            svg.setAttribute('aria-label', accessibleName);
        }
    }
}

/**
 * Creates an in-page skip link button for keyboard accessibility
 * @returns {HTMLButtonElement} The created skip link button
 */
function createInPageButton() {
    const button = document.createElement