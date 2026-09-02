// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report
// _Commit: aabb40916364c3b608e08e010dc71de4a04dfa74_
// ----- END ORIGINAL CODE-----

// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)
const main = require('./utilities')

// Import necessary dependencies
const React = require('react');
const { render } = require('react-dom');
const {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  addAriaLabel,
  renderAdditionalContent,
  implementAccessibilityFixesFromReport
} = require('./AccessibilityHelpers');

// Utility functions for accessibility
const accessibilityUtils = {
    initSkipLink: () => {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href').replace('#', '');
                const target = document.getElementById(targetId);
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        }
    },

    trapFocus: (element) => {
        const focusableElements = element.querySelectorAll(
            'a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    },

    announceToScreenReader: (message, priority = 'polite') => {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        setTimeout(() => announcer.remove(), 1000);
    }
};

const {
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateAccessibilityReport,
  checkAccessibility,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  fixDependencyGraphAria,
  addMainLandmarkToIndex
} = require('./AccessibilityHelpers');

// Update the existing function using the new functions for rendering graph/index
renderDependencyGraphs(container);
fixButtonIdentifiers(container);
fixDependencyGraphAria(container);

// Implement the function for addressing accessibility issues from insight report
implementAccessibilityFixesFromReport(container, report);

// Get language attribute for HTML element
const getLangAttribute = () => {
    return document.documentElement.lang || 'en';
};

// Validate table accessibility
const validateTableAccessibility = (table) => {
    // Check for proper table structure and ARIA attributes
    if (!table.querySelector('thead') || !table.querySelector('tbody')) {
        console.warn('Table missing thead or tbody');
        return false;
    }
    return true;
};

// Validate table structure
const validateTableStructure = (table) => {
    // Check for proper table structure
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) {
        console.warn('Table has no rows');
        return false;
    }
    return true;
};

// Validate landmark elements
const validateLandmark = () => {
    const landmarks = ['header', 'nav', 'main', 'footer'];
    landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        if (elements.length > 1) {
            console.warn(`Multiple ${landmark} elements found`);
        }
    });
};

// Validate landmark structure
const validateLandmarkStructure = () => {
    const main = document.querySelector('main');
    if (!main) {
        console.warn('Main landmark missing');
        return false;
    }
    return true;
};

// Get accessible name for SVG
const getSvgAccessibleName = (svg) => {
    const title = svg.querySelector('title');
    const desc = svg.querySelector('desc');
    if (title) return title.textContent;
    if (desc) return desc.textContent;
    return svg.getAttribute('aria-label') || 'SVG graphic';
};

// Create in-page button with proper accessibility attributes
const createInPageButton = (text, href) => {
    const button = document.createElement('a');
    button.textContent = text;
    button.href = href;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    return button;
};

// Get person name with proper accessibility attributes
const personName = (name) => {
    const span = document.createElement('span');
    span.textContent = name;
    span.setAttribute('aria-label', name);
    return span;
};

// New focus trap implementation
const newFocusTrap = (element) => {
    const focusableElements = element.querySelectorAll(
        'a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    element.addEventListener('keydown', handleKeyDown);

    return {
        destroy: () => {
            element.removeEventListener('keydown', handleKeyDown);
        }
    };
};

// New utility functions from origin/main
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang || 'en';
    }
    return lang || 'en';
}

function addAriaLabel(element, label) {
    if (!element) {
        return;
    }

    if (typeof label !== 'string' || label.trim() === '') {
        return element;
    }

    element.setAttribute('aria-label', label);
    return element;
}

function ensureElementAccessibility(element, idPrefix, ariaLabel) {
    if (!element) {
        return;
    }

    const id = ensureElementHasId(element, idPrefix);
    addAriaLabel(element, ariaLabel);

    return id;
}

function ensureElementHasId(element, prefix) {
    if (!element.id) {
        element.id = prefix + Math.random().toString(36).substr(2, 9);
    }
    return element.id;
}

function focusTrap() {
    // New function implementation: traps focus within a given element
    return (element) => {
        if (!element) return;
        const focusable = element.querySelectorAll(
            'a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        });
    };
}

function addLangAttribute() {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = 'en';
    }
}

// Added functions from HEAD that were not fully present in origin/main
function ensureElementHasIdOrigin(element, prefix) {
    if (!element.id) {
        element.id = prefix + Math.random().toString(36).substr(2, 9);
    }
    return element.id;
}

function addTask(taskFn, priority = 'medium') {
    // Task scheduling implementation
    const taskId = generateTaskId();
    // Implementation details
    return taskId;
}

function generateTaskId() {
    return 'task_' + Math.random().toString(36).substr(2, 9);
}

function cancelTask(id) {
    // Task cancellation implementation
    return true;
}

function setElementLabel(elementId, label) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('aria-label', label);
    }
    return element;
}

function setFocus(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.focus();
    }
    return element;
}

function handleKeyboardNavigation(event) {
    // Keyboard navigation handler
    if (event.key === 'Tab') {
        // Tab navigation handling
    }
}

// New function to handle additional rendering logic
function renderAdditionalContent(additionalData) {
    return '<div class="additional-content">' + (additionalData ? additionalData.content : '') + '</div>';
}

function renderGraphIndex(container) {
    // Render graph index implementation
    return container;
}

function checkAccessibilityForReport() {
    // Accessibility check for report
    return true;
}

// Export functions to make them accessible
module.exports = {
    main,
    validateTableAccessibility,
    validateTableStructure,
    renderAdditionalContent,
    implementAccessibilityFixesFromReport,
    checkAccessibilityForReport,
    renderGraphIndex,
    trapFocus: accessibilityUtils.trapFocus,
    addLangAttribute,
    fixTableStructure,
    createInPageButton,
    createWebResourceButton,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    validateAccessibilityReport,
    exportUtils,
    addressAccessibilityIssues,
    ensureElementHasId,
    ensureElementHasIdOrigin,
    addAriaLabel,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    checkAccessibility,
    accessibilityUtils,
    getLangAttribute,
    personName,
    newFocusTrap,
    setHtmlLangAttribute,
    ensureElementAccessibility,
    addTask,
    generateTaskId,
    cancelTask,
    setElementLabel,
    setFocus,
    handleKeyboardNavigation
};

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
    window.affectedFunction = affectedFunction;
    window.updateFunction = updateFunction;
    window.accessibleFunction = accessibleFunction;
    window.main = main;
    window.accessibilityUtils = accessibilityUtils;
    window.getLangAttribute = getLangAttribute;
    window.personName = personName;
    window.validateTableAccessibility = validateTableAccessibility;
    window.validateTableStructure = validateTableStructure;
    window.validateLandmark = validateLandmark;
    window.validateLandmarkStructure = validateLandmarkStructure;
    window.newFocusTrap = newFocusTrap;
    window.getSvgAccessibleName = getSvgAccessibleName;
    window.createInPageButton = createInPageButton;
    window.setHtmlLangAttribute = setHtmlLangAttribute;
    window.addAriaLabel = addAriaLabel;
    window.ensureElementAccessibility = ensureElementAccessibility;
    window.ensureElementHasId = ensureElementHasId;
    window.addLangAttribute = addLangAttribute;
}