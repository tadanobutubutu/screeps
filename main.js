/**
 * Main application entry point
 * Addresses accessibility requirements from insight report
 */

// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

(function() {
    'use strict';

    // Accessibility utilities
    const AccessibilityUtils = {
        // Reduced motion preference detection
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),

        // High contrast mode detection
        prefersHighContrast: window.matchMedia('(prefers-contrast: more)'),

        // Check if user prefers reduced motion
        shouldReduceMotion: function() {
            return this.prefersReducedMotion.matches;
        },

        // Announce message to screen readers
        announce: function(message, priority) {
            const announcer = document.getElementById('sr-announcer') || this.createAnnouncer();
            announcer.setAttribute('aria-live', priority || 'polite');
            announcer.textContent = message;
            
            // Clear after announcement for repeated messages
            setTimeout(() => { announcer.textContent = ''; }, 1000);
        },

        // Create announcer element if it doesn't exist
        createAnnouncer: function() {
            const announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            document.body.appendChild(announcer);
            return announcer;
        },

        // Trap focus within an element (for modals)
        trapFocus: function(element) {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKey = function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };

            element.addEventListener('keydown', handleTabKey);
            return handleTabKey;
        },

        // Get and set focus management
        getInitialFocus: function(element) {
            const focusable = element.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            return focusable || element;
        }
    };

    // Main initialization
    function init() {
        // Initialize accessibility features
        if (typeof AccessibilityUtils !== 'undefined') {
            // Listen for reduced motion preference changes
            AccessibilityUtils.prefersReducedMotion.addEventListener('change', function(e) {
                if (e.matches) {
                    document.documentElement.classList.add('reduce-motion');
                } else {
                    document.documentElement.classList.remove('reduce-motion');
                }
            });
        }

        // Handle keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Escape key to close modals
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('[role="dialog"]:focus-within');
                if (activeModal) {
                    activeModal.removeAttribute('aria-hidden');
                }
            }
        });

        // Ensure skip link target exists and is focusable
        const skipLink = document.querySelector('a[href^="#"]');
        if (skipLink) {
            const targetId = skipLink.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.setAttribute('tabindex', '-1');
            }
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for use in other modules
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { AccessibilityUtils, init };
    } else {
        window.AccessibilityUtils = AccessibilityUtils;
    }
})();