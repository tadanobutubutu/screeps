// main..js - Accessibility Validator and Utilities

/**
 * Validates landmark structure for accessibility issues
 * Checks for proper use of HTML5 landmark elements and ARIA landmarks
 */

// Common landmark selectors
const LANDMARK_ELEMENTS = [
    'main',
    'nav',
    'aside',
    'header',
    'footer',
    'section',
    'article',
    'form',
];
const LANDMARK_SELECTORS = LANDMARK_ELEMENTS.join(', ');

/**
 * Finds all landmark elements in a document or container
 * @param {Document|Element} context - The context to search within
 * @returns {Element[]} Array of landmark elements
 */
function findLandmarks(context = document) {
    const landmarks = [];
    LANDMARK_ELEMENTS.forEach((tag) => {
        const elements = context.querySelectorAll(tag);
        elements.forEach((el) => landmarks.push(el));
    });
    return landmarks;
}

// TODO: This is the existing code that needs to be preserved

// New function for addressing accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
    // Implementation goes here
    // For example:
    // - Parse the insight report
    // - Apply accessibility fixes based on the report
    // - Return the updated report or a status of the fixes applied
}

// Export the new function if needed
// export { addressAccessibilityIssues };

const fs = require('fs');
const path = require('path');

// Import dependency graph and index content modules
const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
    // Validate input
    if (typeof htmlContent !== 'string') {
        throw new Error('HTML content must be a string');
    }

    const warnings = [];
    const foundLandmarks = {};

    // Check for each landmark element in the HTML content
    LANDMARK_ELEMENTS.forEach((landmark) => {
        // Use case-insensitive regex to find landmark elements
        const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
        const matches = htmlContent.match(regex);
        if (matches) {
            foundLandmarks[landmark] = matches.length;
        }
    });

    // Validate forms have accessible names
    const forms = context.querySelectorAll('form');
    forms.forEach((form, index) => {
        const hasLabel = form.getAttribute('aria-label') || form.getAttribute('aria-labelledby');
        if (!hasLabel && form.querySelectorAll('input, select, textarea').length > 0) {
            issues.push({
                type: 'warning',
                code: 'FORM_WITHOUT_NAME',
                message: `Form at index ${index} should have an accessible name if it contains form controls`,
            });
        }
    });

    // Validate navigation elements
    const navElements = context.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
        const hasLabel = nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby');
        const isMultipleNav = navElements.length > 1 && !hasLabel;
        if (isMultipleNav) {
            issues.push({
                type: 'warning',
                code: 'NAV_WITHOUT_LABEL',
                message: `Navigation at index ${index} should have an aria-label when multiple nav elements exist`,
            });
        }
    });

    // Check for proper header/footer usage
    const headers = context.querySelectorAll('header');
    headers.forEach((header, index) => {
        // Header inside main should be a banner, not a sectioning element
        if (header.closest('main') && !header.closest('article')) {
            issues.push({
                type: 'info',
                code: 'HEADER_NESTING',
                message: `Header at index ${index} is inside main content - consider if this is the intended use`,
            });
        }
    });

    // Check for required main landmark
    if (!foundLandmarks.main) {
        warnings.push('Missing main landmark element');
    }

    // Check for duplicate landmarks (potential issue)
    LANDMARK_ELEMENTS.forEach((landmark) => {
        if (foundLandmarks[landmark] > 1) {
            warnings.push(`Multiple ${landmark} elements found`);
        }
    });

    return {
        foundLandmarks,
        warnings,
        hasMainLandmark: !!foundLandmarks.main,
    };
}

/**
 * Creates an in-page button for the game interface
 * @param {Object} options - Button configuration options
 * @param {string} options.text - The text to display on the button
 * @param {Function} options.onClick - The callback function when button is clicked
 * @param {string} [options.id] - Optional unique identifier for the button
 * @param {string} [options.title] - Optional title/tooltip for the button
 * @param {string} [options.className] - Optional CSS class name for styling
 * @returns {Object} - The created button object
 */
function createInPageButton(options) {
    const { text, onClick, id, title, className } = options;

    // Validate required options
    if (!text) {
        throw new Error('Button text is required');
    }
    if (typeof onClick !== 'function') {
        throw new Error('onClick callback must be a function');
    }

    // Create button object
    const button = {
        id: id || `btn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: String(text),
        title: title || '',
        className: className || 'default-button',
        onClick,
        disabled: false,
        visible: true,
        element: null,
    };

    // Store button reference
    if (!createInPageButton.buttons) {
        createInPageButton.buttons = {};
    }
    createInPageButton.buttons[button.id] = button;
    createInPageButton.buttons[button.id] = button;

    return button;
}

// New function to validate link accessibility and handle fake links
const validateLinkAccessibility = () => {
    const links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.href.startsWith('#') || !link.hasAttribute('href')) {
            handleFakeLinks(link);
        }
    }
};

// New function to handle fake links by wrapping them in an in-page button
const handleFakeLinks = (link) => {
    const fakeLinkButton = createInPageButton({ text: link.textContent, onClick: () => {} });
    link.textContent = '';
    link.setAttribute('target', '_top');
    link.addEventListener('click', (event) => {
        event.preventDefault();
        fakeLinkButton.onClick();
    });
};

// New function to wrap primary content in a main element
const wrapPrimaryContentInMain = () => {
    const primaryContent = document.getElementById('primary-content');
    if (primaryContent) {
        const mainElement = document.createElement('main');
        mainElement.appendChild(primaryContent);
        document.body.insertBefore(mainElement, document.body.firstChild);
    }
};

// New function to count dependencies
function countDependencies() {
    // Existing function implementation

    // New implementation to count dependencies using dependencyGraphContent and regex
    const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`]/g;
    const importCount = (dependencyGraphContent || '').match(importCommentRegExp) || [];
    return importCount.length;
}

// Render index view content using indexContent
function renderIndexView() {
    return indexContent;
}

// Import a11y store configuration
const a11yStore = require('./a11yStore');

// Call the new functions as needed, for example:
addLangAttribute();
// ...
// addMainLandmark();
// ensureUniqueLandmarks();
// ...
// fixFakeLinkIssue();

// New function to handle adding landmark regions
function addLandmarkRegions() {
    const landmarks = {
        main: true,
        nav: false,
        aside: false,
    };

    return {
        landmarks,
        regions: Object.keys(landmarks).filter((key) => landmarks[key]),
    };
}

// Get SVG accessible name helper
function getSvgAccessibleName(svg) {
    return a11yStore.getSvgAccessibleName(svg);
}

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
    if (!report) return;
    a11yStore.addressAccessibilityIssues(report);
}

// Get person name for accessible labeling
function personName() {
    return a11yStore.personName();
}

// Validate and fix table accessibility
function validateTableAccessibility() {
    a11yStore.validateTableAccessibility();
}

// Validate and fix table structure
function validateTableStructure() {
    a11yStore.validateTableStructure();
}

// Validate landmark elements
function validateLandmark() {
    a11yStore.validateLandmark();
}

// Validate landmark structure
function validateLandmarkStructure() {
    a11yStore.validateLandmarkStructure();
}

// Ensure unique landmark IDs
function ensureUniqueLandmarks() {
    a11yStore.ensureUniqueLandmarks();
}

// Fix fake link issues
const fixFakeLinkIssues = () => {
    validateLinkAccessibility();
};

// New function to handle dynamic content updates
function updateLiveRegion(message, priority = 'polite') {
    a11yStore.updateLiveRegion(message, priority);
}

// New function to add IDs to landmark elements
function addLandmarkIds() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((tag) => {
        const landmark = document.querySelector(tag);
        if (landmark && landmark.id === '') {
            landmark.id = `${tag}-${Math.floor(Math.random() * 1000)}`;
        }
    });
}

// New function to check landmark elements in the DOM
function checkLandmarkElementsInDom() {
    a11yStore.checkLandmarkElements();
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
    a11yStore.addSVGAccessibilityProps();
}

// Preserve existing code functionality
function preserveExistingCode() {
    a11yStore.preserveExistingCode();
}

// New function to address new accessibility issues from insight report
function newFunction() {
    // Placeholder for new accessibility issue fixes
    // Implement specific fixes based on insight report when available
}

// New function to get the language attribute value
const getLangAttribute = () => {
    // Assuming the function to determine the page language
    // This is a placeholder for the actual implementation
    return 'en';
};

// Example of addressing REACT_015: Add lang attribute to HTML element
function addLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
        const lang = getLangAttribute();
        htmlElement.setAttribute('lang', lang);
    }
}

// Call the function to set the lang attribute
addLangAttribute();

// Continue with the rest of your existing code here...

module.exports = {
    checkLandmarkElements,
    createInPageButton,
    countDependencies,
    a11yStore,
    addLandmarkRegions,
    addressAccessibilityIssues,
    LANDMARK_ELEMENTS,
    getLangAttribute: a11yStore.getLangAttribute.bind(a11yStore),
    updateLiveRegion,
    addSVGAccessibilityProps,
    preserveExistingCode,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    ensureUniqueLandmarks,
    fixFakeLinkIssues,
    addLandmarkIds,
    checkLandmarkElementsInDom,
    newFunction,
    addLangAttribute,
    getLangAttribute,
    renderIndexView,
    wrapPrimaryContentInMain,
    validateLinkAccessibility,
    handleFakeLinks,
};
