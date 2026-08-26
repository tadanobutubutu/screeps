// Address accessibility issues from insight report

// main.js - Accessibility-focused JavaScript
// This file handles core functionality with accessibility best practices

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        focusableSelectors: 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        skipLinkSelector: '.skip-link',
        mainContentSelector: 'main, [role="main"]'
    };

    // ARIA Live Region for screen reader announcements
    function createLiveRegion() {
        let liveRegion = document.getElementById('aria-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
            document.body.appendChild(liveRegion);
        }
        return liveRegion;
    }

    // Announce message to screen readers
    function announce(message, priority = 'polite') {
        const liveRegion = createLiveRegion();
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }

    // Focus management utilities
    const focusManager = {
        // Store the previously focused element
        lastFocusedElement: null,

        // Save current focus
        saveFocus() {
            this.lastFocusedElement = document.activeElement;
        },

        // Restore focus to previously focused element
        restoreFocus() {
            if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
                this.lastFocusedElement.focus();
            }
        },

        // Focus first focusable element in a container
        focusFirst(container = document.body) {
            const focusable = container.querySelector(CONFIG.focusableSelectors);
            if (focusable) {
                focusable.focus();
                return true;
            }
            return false;
        },

        // Focus element by selector
        focusElement(selector) {
            const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
            if (element && typeof element.focus === 'function') {
                element.focus();
                return true;
            }
            return false;
        }
    };

    // Skip link functionality
    function initSkipLink() {
        const skipLink = document.querySelector(CONFIG.skipLinkSelector);
        const mainContent = document.querySelector(CONFIG.mainContentSelector);

        if (skipLink && mainContent) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                focusManager.saveFocus();
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
                announce('Skipped to main content');
            });
        }
    }

    // Focus trap for modals and dialogs
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(CONFIG.focusableSelectors);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        function handleTabKey(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }

        element.addEventListener('keydown', handleTabKey);
        firstFocusable?.focus();

        return () => {
            element.removeEventListener('keydown', handleTabKey);
        };
    }

    // Handle escape key to close modals
    function handleEscapeKey(callback) {
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                callback();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }

    // Reduce motion preference check
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Minimal accessible initialization function
    function initializeApp() {
        // Application initialization
        console.log('Application initialized');
    }

    // Initialize on DOM ready
    function init() {
        initializeApp();
        initSkipLink();

        // Set up reduced motion preference listener
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addEventListener('change', (e) => {
            document.documentElement.classList.toggle('reduce-motion', e.matches);
            announce(e.matches ? 'Reduced motion enabled' : 'Reduced motion disabled');
        });

        // Initial reduced motion class
        if (prefersReducedMotion()) {
            document.documentElement.classList.add('reduce-motion');
        }
    }

    // Export functions for use by other modules
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            initializeApp,
            announce,
            focusManager,
            trapFocus,
            handleEscapeKey,
            prefersReducedMotion,
            createLiveRegion
        };
    } else {
        window.mainJS = {
            initializeApp,
            announce,
            focusManager,
            trapFocus,
            handleEscapeKey,
            prefersReducedMotion,
            createLiveRegion,
            CONFIG
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();