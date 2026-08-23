// TODO: Address accessibility issues from insight report:
// - Missing ARIA labels on interactive elements
// - Keyboard navigation support needed
// - Focus management improvements required

(function() {
    'use strict';

    // Utility function to handle focus management
    function manageFocus(element) {
        if (element && element.focus) {
            element.focus();
        }
    }

    // Utility function to create accessible button
    function createAccessibleButton(options) {
        const button = document.createElement('button');
        button.textContent = options.label || 'Button';
        button.setAttribute('aria-label', options.ariaLabel || options.label);
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('role', 'button');
        
        if (options.id) {
            button.id = options.id;
        }
        
        button.addEventListener('click', function() {
            const isPressed = this.getAttribute('aria-pressed') === 'true';
            this.setAttribute('aria-pressed', !isPressed);
            if (options.onClick) {
                options.onClick();
            }
        });

        // Keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        return button;
    }

    // Utility function to create accessible link
    function createAccessibleLink(options) {
        const link = document.createElement('a');
        link.textContent = options.label || 'Link';
        link.setAttribute('href', options.href || '#');
        link.setAttribute('aria-label', options.ariaLabel || options.label);
        
        if (options.onClick) {
            link.addEventListener('click', options.onClick);
        }

        // Keyboard support
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.click();
            }
        });

        return link;
    }

    // Trap focus within a container (for modals, dialogs, etc.)
    function trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        container.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

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
        });

        if (firstElement) {
            firstElement.focus();
        }
    }

    // Release focus trap
    function releaseFocus(container, previousActiveElement) {
        container.removeEventListener('keydown', trapFocus);
        if (previousActiveElement && previousActiveElement.focus) {
            previousActiveElement.focus();
        }
    }

    // Announce message to screen readers
    function announceToScreenReader(message, politeness = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', politeness);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.position = 'absolute';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.padding = '0';
        announcement.style.margin = '-1px';
        announcement.style.overflow = 'hidden';
        announcement.style.clip = 'rect(0, 0, 0, 0)';
        announcement.style.whiteSpace = 'nowrap';
        announcement.style.border = '0';
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.textContent = message;
        }, 100);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Initialize accessibility features
    function init() {
        // Add skip link functionality
        const skipLink = document.querySelector('[href="#main-content"]');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.getElementById('main-content') || document.querySelector('main');
                if (target) {
                    manageFocus(target);
                }
            });
        }

        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('[onclick], [onfocus], [onblur]');
        interactiveElements.forEach(function(element) {
            if (!element.hasAttribute('tabindex') && 
                !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
                element.setAttribute('tabindex', '0');
            }
        });
    }

    // Export utilities for external use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            createAccessibleButton,
            createAccessibleLink,
            manageFocus,
            trapFocus,
            releaseFocus,
            announceToScreenReader,
            init
        };
    } else {
        window.AccessibilityUtils = {
            createAccessibleButton,
            createAccessibleLink,
            manageFocus,
            trapFocus,
            releaseFocus,
            announceToScreenReader,
            init
        };
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();