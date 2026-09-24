// main.js - Main application logic with accessibility improvements
// TODO: Address accessibility issues from insight report — CONTINUING
// - Added keyboard navigation support
// - Added ARIA labels for interactive elements
// - Added screen reader announcements
// - Added focus trapping for modals

// Global state
let focusTrapActive = false;
let lastFocusedElement = null;

// Screen reader announcement utility
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// Focus trapping for modals
function trapFocus(element) {
    if (!element || focusTrapActive) return;
    
    focusTrapActive = true;
    lastFocusedElement = document.activeElement;
    
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
    
    element.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    if (firstFocusable) {
        firstFocusable.focus();
    }
    
    return () => {
        focusTrapActive = false;
        element.removeEventListener('keydown', handleTabKey);
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };
}

// Release focus trap
function releaseFocus() {
    focusTrapActive = false;
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

// Keyboard navigation handler
function handleKeyboardNavigation(event, callbacks = {}) {
    const { onEnter, onEscape, onArrowUp, onArrowDown, onTab } = callbacks;
    
    switch (event.key) {
        case 'Enter':
            if (onEnter) {
                event.preventDefault();
                onEnter(event);
                announceToScreenReader('Action confirmed');
            }
            break;
        case 'Escape':
            if (onEscape) {
                event.preventDefault();
                onEscape(event);
                announceToScreenReader('Action cancelled');
            }
            break;
        case 'ArrowUp':
            if (onArrowUp) {
                event.preventDefault();
                onArrowUp(event);
                announceToScreenReader('Moved up');
            }
            break;
        case 'ArrowDown':
            if (onArrowDown) {
                event.preventDefault();
                onArrowDown(event);
                announceToScreenReader('Moved down');
            }
            break;
        case 'Tab':
            if (onTab) {
                onTab(event);
            }
            break;
    }
}

// Add ARIA labels to interactive elements
function enhanceAccessibility(container = document) {
    // Add ARIA labels to buttons without text
    container.querySelectorAll('button').forEach(button => {
        if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
            const icon = button.querySelector('svg, img, i');
            if (icon) {
                button.setAttribute('aria-label', 'Interactive button');
            }
        }
    });
    
    // Ensure all interactive elements are properly labeled
    container.querySelectorAll('[role="button"]').forEach(element => {
        if (!element.textContent.trim() && !element.getAttribute('aria-label')) {
            element.setAttribute('aria-label', 'Interactive element');
        }
    });
}

// Initialize accessibility features
function initAccessibility() {
    enhanceAccessibility();
    
    // Global keyboard handling
    document.addEventListener('keydown', (e) => {
        // Escape key closes modals
        if (e.key === 'Escape' && focusTrapActive) {
            releaseFocus();
            announceToScreenReader('Modal closed');
        }
    });
}

// Export utilities for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        announceToScreenReader,
        trapFocus,
        releaseFocus,
        handleKeyboardNavigation,
        enhanceAccessibility,
        initAccessibility
    };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibility);
    } else {
        initAccessibility();
    }
}

// Application initialization
function initApp() {
    console.log('Application initialized with accessibility features');
    
    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.top = 'auto';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.overflow = 'hidden';
    skipLink.addEventListener('focus', () => {
        skipLink.style.position = 'static';
        skipLink.style.width = 'auto';
        skipLink.style.height = 'auto';
        skipLink.style.overflow = 'visible';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    announceToScreenReader('Application loaded');
}

// Auto-initialize app
if (typeof document !== 'undefined') {
    initApp();
}