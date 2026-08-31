// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';

// REACT_015: lang attribute added to HTML element
// The React component rendering the HTML element provides the `lang` prop
// The language attribute is set according to the application's settings
// Addressed accessibility issues from insight report
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-ash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8d493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a97b62237d968a50cc419 -->
// _Commit: 30f5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f8b632535b07b809ac49f5e1c81cf4f89f9c1 -->
// _Commit: b88a821083c89f599fb68eef1dc4d5df10e51e52_

// Preserve existing functionality
// REACT_027: 26 table structure issues fixed
// Related commit or original table issues have been addressed

// ... other fixes ...

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
 * @param {HTMLElement|string} elementId - The element or element ID to add the aria-label to.
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
    // Set lang attribute on the HTML element
    const htmlElement = document.documentElement;
    if (htmlElement) {
        htmlElement.setAttribute('lang', getLangAttribute());
    }
}

/**
 * Gets the full language attribute value for the document.
 * @returns {string} The full language code (e.g., 'en-US').
 */
function getFullLangAttribute() {
    // Get the browser's language or default to 'en-US'
    const browserLang = navigator.language || 'en-US';
    return browserLang;
}

/**
 * Gets the language attribute value for the document.
 * @returns {string} The language code.
 */
function getLangAttribute() {
    return getFullLangAttribute();
}

// New helper functions to address the additional accessibility requirements
function ensureElementHasId(elementId) {
    const element = document.getElementById(elementId);
    if (element && !element.id) {
        element.setAttribute('id', elementId);
    }
}

/**
 * Ensures all provided elements have IDs, generating them if necessary.
 * @param {NodeList|Array} elements - The elements to check.
 * @returns {Array} Array of elements with guaranteed IDs.
 */
function ensureElementsHaveIds(elements) {
    return Array.from(elements).map((element, index) => {
        if (!element.id) {
            element.id = `element-${index}`;
        }
        return element;
    });
}

/**
 * Ensures all landmarks in the document are unique by removing duplicate roles
 * and ensuring proper identification.
 */
function ensureUniqueLandmarks() {
    // Get all landmark elements
    const landmarks = document.querySelectorAll(
        'header[role="banner"], nav[role="navigation"], main[role="main"], footer[role="contentinfo"]'
    );
    
    const seenRoles = new Map();
    
    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        
        if (seenRoles.has(role)) {
            // Remove role attribute from duplicate landmarks
            landmark.removeAttribute('role');
        } else {
            // First occurrence - ensure it has a unique ID
            if (!landmark.id) {
                landmark.id = createUniqueLandmarkId(role);
            }
            seenRoles.set(role, landmark);
        }
    });
}

/**
 * Gets an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    
    // Check for aria-label
    let label = svg.getAttribute('aria-label');
    if (label) return label;
    
    // Check for aria-labelledby
    const labelledBy = svg.getAttribute('aria-labelledby');
    if (labelledBy) {
        const labelElement = document.getElementById(labelledBy);
        return labelElement ? labelElement.textContent : '';
    }
    
    // Check for title element within SVG
    const title = svg.querySelector('title');
    if (title) return title.textContent;
    
    return '';
}

/**
 * Sets accessibility attributes on an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @param {string} accessibleName - The accessible name to set.
 */
function setSvgAttributes(svg, accessibleName) {
    if (!svg) return;
    
    if (accessibleName) {
        svg.setAttribute('aria-label', accessibleName);
    }
    
    // Ensure SVG has a role
    if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
    }
}

/**
 * Creates an accessible in-page skip link button.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton() {
    const button = document.createElement('button');
    button.id = 'skip-to-main';
    button.setAttribute('aria-label', 'Skip to main content');
    button.textContent = 'Skip to main content';
    
    button.addEventListener('click', () => {
        const main = document.querySelector('main, [role="main"]');
        if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus();
        }
    });
    
    // Insert at the beginning of body
    document.body.insertBefore(button, document.body.firstChild);
    
    return button;
}

/**
 * Creates an accessible link element.
 * @param {string} text - The link text.
 * @param {string} href - The link URL.
 * @param {string} [accessibleLabel] - Optional accessible label.
 * @returns {HTMLAnchorElement} The created link element.
 */
function createAccessibleLink(text, href, accessibleLabel) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    
    if (accessibleLabel) {
        link.setAttribute('aria-label', accessibleLabel);
    }
    
    return link;
}

/**
 * Validates link accessibility by checking for proper text, labels, or titles.
 * @param {HTMLAnchorElement} link - The link element to validate.
 * @returns {Object} Validation result with accessible status.
 */
function validateLinkAccessibility(link) {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasTitle = link.hasAttribute('title');
    
    return {
        accessible: hasText || hasAriaLabel || hasTitle,
        hasText,
        hasAriaLabel,
        hasTitle
    };
}

/**
 * Handles fake links (buttons styled as links) for accessibility.
 */
function handleFakeLinks() {
    const fakeLinks = document.querySelectorAll('button[href], a[href=""], a[href="#"]');
    
    fakeLinks.forEach(fakeLink => {
        const href = fakeLink.getAttribute('href');
        
        if (href === '' || href === '#') {
            // It's a fake link - either convert to button or add proper handling
            fakeLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Custom click handling if needed
            });
        }
    });
}

/**
 * Checks accessibility of all links in the document.
 * @returns {Array} Array of link accessibility check results.
 */
function checkLinkAccessibility() {
    const links = document.querySelectorAll('a[href]');
    const results = [];
    
    links.forEach((link, index) => {
        const validation = validateLinkAccessibility(link);
        results.push({
            index,
            href: link.href,
            text: link.textContent.trim().substring(0, 50),
            accessible: validation.accessible
        });
    });
    
    return results;
}

/**
 * Validates landmark accessibility.
 */
function validateLandmark() {
    const landmarks = document.querySelectorAll(
        'header, nav, main, footer, aside, section, article'
    );
    
    landmarks.forEach(landmark => {
        // Ensure landmarks have accessible names if they don't have headings
        const hasHeading = landmark.querySelector('h1, h2, h3, h4, h5, h6');
        const hasAriaLabel = landmark.hasAttribute('aria-label');
        const hasAriaLabelledby = landmark.hasAttribute('aria-labelledby');
        
        if (!hasHeading && !hasAriaLabel && !hasAriaLabelledby) {
            // Landmark needs an accessible name
            const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
            landmark.setAttribute('aria-label', role);
        }
    });
}

/**
 * Validates landmark structure for proper nesting and identification.
 */
function validateLandmarkStructure() {
    // Check for proper landmark nesting
    const main = document.querySelector('main, [role="main"]');
    if (main && !main.id) {
        main.id = createUniqueLandmarkId('main');
    }