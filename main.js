/**
 * Main application JavaScript
 * Addresses accessibility issues from insight report
 */

// Track current focus for restoration
let previousFocus = null;

/**
 * Traps focus within an element for modal dialogs
 * @param {HTMLElement} element - The container element to trap focus within
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
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
        if (e.key === 'Escape') {
            closeModal(element);
        }
    });
}

/**
 * Announces a message to screen readers using ARIA live region
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
    const announcer = document.getElementById('aria-live-announcer') || createAnnouncer();
    announcer.textContent = message;
}

/**
 * Creates an ARIA live region for screen reader announcements
 * @returns {HTMLElement} The announcer element
 */
function createAnnouncer() {
    const announcer = document.createElement('div');
    announcer.id = 'aria-live-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);
    return announcer;
}

/**
 * Opens a modal dialog with proper focus management
 * @param {HTMLElement} modal - The modal element to open
 */
function openModal(modal) {
    previousFocus = document.activeElement;
    modal.removeAttribute('aria-hidden');
    modal.style.display = 'block';
    
    const firstFocusable = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
        firstFocusable.focus();
    }
    
    trapFocus(modal);
    announceToScreenReader('Dialog opened');
}

/**
 * Closes a modal dialog and restores focus
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    
    if (previousFocus) {
        previousFocus.focus();
    }
    
    announceToScreenReader('Dialog closed');
}

/**
 * Updates interactive elements with proper ARIA attributes
 * @param {string} selector - CSS selector for elements to update
 */
function updateAccessibleInteractiveElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        if (!element.id) {
            element.id = `interactive-${index}`;
        }
    });
}

// Initialize accessibility features on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all buttons have accessible names
    document.querySelectorAll('button').forEach(function(button) {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            console.warn('Button missing accessible name:', button);
        }
    });
    
    // Ensure form inputs have associated labels
    document.querySelectorAll('input, select, textarea').forEach(function(input) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            console.warn('Form element missing label:', input);
        }
    });
    
    // Add keyboard support for custom interactive elements
    document.querySelectorAll('[role="button"], [role="menuitem"]').forEach(function(element) {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
    
    // Remove tabindex from non-interactive elements that might have it
    document.querySelectorAll('div, span, p, article, section').forEach(function(element) {
        if (element.hasAttribute('tabindex') && !element.getAttribute('role')) {
            element.removeAttribute('tabindex');
        }
    });
});

// Export functions for use elsewhere
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trapFocus,
        announceToScreenReader,
        openModal,
        closeModal,
        updateAccessibleInteractiveElements
    };
}