// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

/**
 * Generates the lang attribute value for the HTML element
 * @returns {string} The language code (e.g., 'en', 'es', 'fr')
 */
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

/**
 * Adds accessible names to SVG elements
 * @param {string} svgId - The ID of the SVG element
 * @param {string} accessibleName - The accessible name to add
 */
function addSvgAccessibleName(svgId, accessibleName) {
    const svg = document.getElementById(svgId);
    if (svg) {
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', accessibleName);
        
        // Also add title element if not present
        const title = svg.querySelector('title');
        if (!title) {
            const titleEl = document.createElement('title');
            titleEl.textContent = accessibleName;
            svg.insertBefore(titleEl, svg.firstChild);
        }
    }
}

/**
 * Fixes fake link issues by converting them to proper buttons or adding button role
 * @param {string} selector - CSS selector for fake links
 */
function fixFakeLinks(selector) {
    const fakeLinks = document.querySelectorAll(selector);
    fakeLinks.forEach(link => {
        if (link.tagName === 'A' && !link.href) {
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');
        }
    });
}

/**
 * Ensures landmarks have unique accessible names
 * @param {string} landmarkType - Type of landmark (e.g., 'nav', 'main', 'header')
 * @param {Object} names - Object mapping landmark instances to unique names
 */
function ensureUniqueLandmarks(landmarkType, names) {
    const landmarks = document.querySelectorAll(landmarkType);
    let index = 1;
    landmarks.forEach(landmark => {
        if (landmark.tagName === 'NAV' && !landmark.getAttribute('aria-label')) {
            landmark.setAttribute('aria-label', `Navigation ${index}`);
            index++;
        }
    });
}

/**
 * Adds proper landmark roles to semantic HTML elements
 * @param {string} selector - CSS selector for elements needing landmark roles
 * @param {string} role - ARIA role to add
 */
function addLandmarkRole(selector, role) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        if (!el.getAttribute('role')) {
            el.setAttribute('role', role);
        }
    });
}

// Initialize accessibility fixes
function initAccessibility() {
    // REACT_015: Ensure lang attribute is set
    const lang = getLangAttribute();
    document.documentElement.lang = lang;
    
    // REACT_017: Add landmark roles
    addLandmarkRole('header', 'banner');
    addLandmarkRole('nav', 'navigation');
    addLandmarkRole('main', 'main');
    addLandmarkRole('footer', 'contentinfo');
    
    // REACT_025: Ensure unique landmarks
    ensureUniqueLandmarks('nav', {});
    
    // REACT_041: Add accessible names to SVGs
    addSvgAccessibleName('svg-primary', 'Primary chart');
    addSvgAccessibleName('svg-secondary', 'Secondary illustration');
    
    // REACT_036: Fix fake links
    fixFakeLinks('a:not([href])');
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibility);
    } else {
        initAccessibility();
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getLangAttribute,
        addSvgAccessibleName,
        fixFakeLinks,
        ensureUniqueLandmarks,
        addLandmarkRole,
        initAccessibility
    };
}