// Accessibility-related imports or setup
// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

/**
 * Initialize accessibility features for the application
 * Creates an ARIA live region for screen reader announcements
 */
function initializeAccessibility() {
    // Check if live region already exists
    let liveRegion = document.querySelector('[role="status"]');
    
    if (!liveRegion) {
        // Create ARIA live region for screen reader announcements
        liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
    
    return liveRegion;
}

/**
 * Announce a message to screen readers using ARIA live region
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
    const liveRegion = document.querySelector('[role="status"]');
    if (liveRegion) {
        // Clear and set new message to ensure announcement
        liveRegion.textContent = '';
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }
}

/**
 * Trap focus within an element (useful for modals/dialogs)
 * @param {HTMLElement} element - The element to trap focus within
 * @returns {function} Cleanup function to remove event listeners
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), ' +
        'input:not([disabled]), select:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function handleKeyDown(e) {
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
    }

    element.addEventListener('keydown', handleKeyDown);
    
    // Return cleanup function
    return function removeTrapFocus() {
        element.removeEventListener('keydown', handleKeyDown);
    };
}

/**
 * Handle keyboard navigation for interactive elements
 * @param {KeyboardEvent} event - The keyboard event
 * @param {function} callback - Function to call on valid key press
 */
function handleKeyboardNavigation(event, callback) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        callback();
    }
}

/**
 * Update ARIA label for an element
 * @param {HTMLElement} element - The element to update
 * @param {string} label - The new label text
 */
function updateAriaLabel(element, label) {
    if (element && typeof element.setAttribute === 'function') {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Export functions for testing and external use
module.exports = {
    initializeAccessibility,
    announceToScreenReader,
    trapFocus,
    handleKeyboardNavigation,
    updateAriaLabel,
    prefersReducedMotion
};