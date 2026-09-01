import React from 'react';

// Utility functions for accessibility
const accessibilityUtils = {
    initSkipLink: () => {
        const skipLink = document.querySelector('#skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        }
    },

    trapFocus: (element) => {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
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
    },

    handleKeyboardNav: (e, handlers) => {
        const key = e.key;
        if (handlers[key]) {
            handlers[key](e);
        }
    },

    // Get language attribute for HTML element
    getLangAttribute: () => {
        return document.documentElement.getAttribute('lang') || 'en';
    },

    // Validate table accessibility
    validateTableAccessibility: (table) => {
        // Check for proper table structure and ARIA attributes
        if (!table.querySelector('thead') || !table.querySelector('tbody')) {
            console.warn('Table missing thead or tbody');
            return false;
        }
        return true;
    },

    // Validate table structure
    validateTableStructure: (table) => {
        // Check for proper table structure
        const rows = table.querySelectorAll('tr');
        if (rows.length === 0) {
            console.warn('Table has no rows');
            return false;
        }
        return true;
    },

    // Validate landmark elements
    validateLandmark: () => {
        const landmarks = ['header', 'nav', 'main', 'footer'];
        landmarks.forEach(landmark => {
            const elements = document.querySelectorAll(landmark);
            if (elements.length > 1) {
                console.warn(`Multiple ${landmark} elements found`);
            }
        });
    },

    // Validate landmark structure
    validateLandmarkStructure: () => {
        const main = document.querySelector('main');
        if (!main) {
            console.warn('Main landmark missing');
            return false;
        }
        return true;
    },

    // Get accessible name for SVG
    getSvgAccessibleName: (svg) => {
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        if (title) return title.textContent;
        if (desc) return desc.textContent;
        return svg.getAttribute('aria-label') || 'SVG graphic';
    },

    // Create in-page button with proper accessibility attributes
    createInPageButton: (text, href) => {
        const button = document.createElement('a');
        button.textContent = text;
        button.href = href;
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        return button;
    },

    // Get person name with proper accessibility attributes
    personName: (name) => {
        const span = document.createElement('span');
        span.textContent = name;
        span.setAttribute('aria-label', name);
        return span;
    },

    // New focus trap implementation
    newFocusTrap: (element) => {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        element.addEventListener('keydown', handleKeyDown);

        return {
            destroy: () => {
                element.removeEventListener('keydown', handleKeyDown);
            }
        };
    }
};

// New utility functions from origin/main
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', lang || 'en');
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

function newFocusTrap() {
    // New function implementation: traps focus within a given element
    return (element) => {
        if (!element) return;
        const focusable = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
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
    document.documentElement.setAttribute('lang', 'en');
}

// Export functions to make them accessible
module.exports = {
    affectedFunction,
    updateFunction,
    accessibleFunction,
    main,
    createWebResourceButton,
    validateAccessibilityReport,
    CONFIG,
    accessibilityUtils,
    log,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    newFocusTrap,
    getSvgAccessibleName,
    createInPageButton,
    setHtmlLangAttribute,
    addAriaLabel,
    ensureElementAccessibility,
    ensureElementHasId,
    addLangAttribute
};

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
    window.affectedFunction = affectedFunction;
    window.updateFunction = updateFunction;
    window.accessibleFunction = accessibleFunction;
    window.main = main;
    window.createWebResourceButton = createWebResourceButton;
    window.validateAccessibilityReport = validateAccessibilityReport;
    window.CONFIG = CONFIG;
    window.log = log;
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