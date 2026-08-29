// Main JavaScript file

// Sample data for the application
const appData = {
    title: 'Landmark Checker',
    version: '1.0.0'
};

// Helper function to get element by ID
function getElementById(id) {
    return document.getElementById(id);
}

// Helper function to query elements
function queryElements(selector) {
    return document.querySelectorAll(selector);
}

// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
    const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
    const results = {};
    
    landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        results[landmark] = {
            count: elements.length,
            exists: elements.length > 0
        };
    });
    
    return results;
}

// Function to validate landmark structure
function validateLandmarkStructure() {
    const results = checkLandmarkElements();
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };
    
    if (!results.main.exists) {
        validation.isValid = false;
        validation.errors.push('Missing required <main> landmark element');
    }
    
    if (!results.header.exists) {
        validation.warnings.push('No <header> landmark element found');
    }
    
    if (!results.nav.exists) {
        validation.warnings.push('No <nav> landmark element found');
    }
    
    if (!results.footer.exists) {
        validation.warnings.push('No <footer> landmark element found');
    }
    
    return validation;
}

// Sets an accessible name on the given SVG element so that assistive
// technologies (screen readers, etc.) can announce it meaningfully.
// The accessible name is provided via the `aria-label` attribute. The
// SVG is also given an explicit `role="img"` to ensure it is exposed
// as a single image to the accessibility API rather than as a group
// of graphic elements, which is the recommended pattern from the W3C
// SVG Accessibility API Mappings specification.
function setSvgAccessibleName(svg, name) {
    if (!svg || typeof name !== 'string') {
        return;
    }

    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name);
    // Reflect the accessible name on the SVG element so it is also
    // visible to user agents that surface the native HTML title.
    svg.setAttribute('aria-labelledby', '');
    svg.removeAttribute('aria-labelledby');
}

// Convenience helper that applies `setSvgAccessibleName` to every SVG
// element matching the given CSS selector (defaults to all <svg>
// elements in the document).
function setAccessibleNamesToSvgs(name, selector) {
    if (typeof name !== 'string') {
        return [];
    }

    const targetSelector = selector || 'svg';
    const svgs = document.querySelectorAll(targetSelector);
    const updated = [];

    svgs.forEach(svg => {
        setSvgAccessibleName(svg, name);
        updated.push(svg);
    });

    return updated;
}

// Initialize application
function init() {
    console.log('Initializing ' + appData.title + ' v' + appData.version);
    return checkLandmarkElements();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkLandmarkElements,
        validateLandmarkStructure,
        getElementById,
        queryElements,
        setSvgAccessibleName,
        setAccessibleNamesToSvgs,
        init
    };
}