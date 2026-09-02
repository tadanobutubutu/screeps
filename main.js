Here's the resolved file with both changes integrated:

```javascript
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

    getLangAttribute: () => {
        return document.documentElement.getAttribute('lang') || 'en';
    },

    validateTableAccessibility: (table) => {
        // Check for proper table structure and ARIA attributes
        if (!table.querySelector('thead') || !table.querySelector('tbody')) {
            console.warn('Table missing thead or tbody');
            return false;
        }
        return true;
    },

    validateTableStructure: (table) => {
        // Check for proper table structure
        const rows = table.querySelectorAll('tr');
        if (rows.length === 0) {
            console.warn('Table has no rows');
            return false;
        }
        return true;
    },

    validateLandmark: () => {
        const landmarks = ['header', 'nav', 'main', 'footer'];
        landmarks.forEach(landmark => {
            const elements = document.querySelectorAll(landmark);
            if (elements.length > 1) {
                console.warn(`Multiple ${landmark} elements found`);
            }
        });
    },

    validateLandmarkStructure: () => {
        const main = document.querySelector('main');
        if (!main) {
            console.warn('Main landmark missing');
            return false;
        }
        return true;
    },

    getSvgAccessibleName: (svg) => {
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        if (title) return title.textContent;
        if (desc) return desc.textContent;
        return svg.getAttribute('aria-label') || 'SVG graphic';
    },

    createInPageButton: (text, href) => {
        const button = document.createElement('a');
        button.textContent = text;
        button.href = href;
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        return button;
    },

    personName: (name) => {
        const span = document.createElement('span');
        span.textContent = name;
        span.setAttribute('aria-label', name);
        return span;
    },

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
    },

    // New utility functions from origin/main
    setHtmlLangAttribute: (lang) => {
        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.setAttribute('lang', lang || 'en');
        }
        return lang || 'en';
    },

    addAriaLabel: (element, label) => {
        if (!element) {
            return;
        }

        if (typeof label !== 'string' || label.trim() === '') {
            return element;
        }

        element.setAttribute('aria-label', label);
        return element;
    },

    ensureElementAccessibility: (element, idPrefix, ariaLabel) => {
        if (!element) {
            return;
        }

        const id = ensureElementHasId(element, idPrefix);
        addAriaLabel(element, ariaLabel);

        return id;
    },

    ensureElementHasId: (element, prefix) => {
        if (!element.id) {
            element.id = prefix + Math.random().toString(36).substr(2, 9);
        }
        return element.id;
    },

    newFocusTrap: newFocusTrap(),

    addLangAttribute: addLangAttribute,

    getAccessibleSvgFavicon: getAccessibleSvgFavicon
};

// Export functions to make them accessible
module.exports = {
    accessibilityUtils,
    setHtmlLangAttribute,
    addAriaLabel,
    ensureElementAccessibility,
    ensureElementHasId,
    newFocusTrap,
    addLangAttribute,
    getAccessibleSvgFavicon,
    // Also attach to global scope for browser/standalone access
    ...accessibilityUtils
};
```