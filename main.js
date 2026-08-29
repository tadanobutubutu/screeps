// Accessibility-focused JavaScript module

// TODO: Address accessibility issues from insight report:

/**
 * Initialize accessibility features for the application
 */
function initializeAccessibility() {
    // Set up keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Set up focus management
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    
    // Set up click handler for accessibility
    document.addEventListener('click', handleClickAccessibility);
    
    // Initialize ARIA live regions
    initializeAriaLiveRegions();
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboardNavigation(event) {
    const target = event.target;
    
    // Support space and enter for button-like elements
    if ((event.key === ' ' || event.key === 'Enter') && 
        (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button')) {
        event.preventDefault();
        target.click();
    }
    
    // Escape key handling for modals/dialogs
    if (event.key === 'Escape' && target.getAttribute('aria-expanded') === 'true') {
        target.setAttribute('aria-expanded', 'false');
    }
    
    // Arrow key navigation for menu items
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        handleArrowKeyNavigation(event, target);
    }
}

/**
 * Handle arrow key navigation
 * @param {KeyboardEvent} event - The keyboard event
 * @param {HTMLElement} target - The current target element
 */
function handleArrowKeyNavigation(event, target) {
    const menuItems = document.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    const currentIndex = Array.from(menuItems).indexOf(target);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    const isVertical = event.key === 'ArrowUp' || event.key === 'ArrowDown';
    
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % menuItems.length;
    } else {
        nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    }
    
    menuItems[nextIndex].focus();
}

/**
 * Handle focus in events
 * @param {FocusEvent} event - The focus event
 */
function handleFocusIn(event) {
    const target = event.target;
    
    // Add visual focus indicator
    if (target.matches(':focus-visible')) {
        target.classList.add('focus-visible');
    }
    
    // Announce focused elements to screen readers
    if (target.hasAttribute('aria-label')) {
        announceToScreenReader(`Focused: ${target.getAttribute('aria-label')}`);
    }
}

/**
 * Handle focus out events
 * @param {FocusEvent} event - The focus event
 */
function handleFocusOut(event) {
    const target = event.target;
    
    // Remove visual focus indicator
    target.classList.remove('focus-visible');
    
    // Announce when leaving elements
    if (target.hasAttribute('aria-label')) {
        announceToScreenReader(`Left: ${target.getAttribute('aria-label')}`);
    }
}

/**
 * Handle click accessibility
 * @param {MouseEvent} event - The mouse event
 */
function handleClickAccessibility(event) {
    const target = event.target;
    
    // Update aria-pressed for toggle buttons
    if (target.hasAttribute('aria-pressed')) {
        const isPressed = target.getAttribute('aria-pressed') === 'true';
        target.setAttribute('aria-pressed', !isPressed);
    }
    
    // Update aria-expanded for expandable elements
    if (target.hasAttribute('aria-expanded')) {
        target.setAttribute('aria-expanded', 'true');
    }
}

/**
 * Initialize ARIA live regions
 */
function initializeAriaLiveRegions() {
    // Create polite live region for announcements
    let liveRegion = document.getElementById('aria-live-region');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
        document.body.appendChild(liveRegion);
    }
    
    return liveRegion;
}

/**
 * Announce message to screen readers
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region') || initializeAriaLiveRegions();
    
    // Clear and set message to ensure announcement
    liveRegion.textContent = '';
    setTimeout(() => {
        liveRegion.textContent = message;
    }, 100);
}

/**
 * Manage focus for modal dialogs
 * @param {HTMLElement} modalElement - The modal element
 */
function trapFocusInModal(modalElement) {
    const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modalElement.addEventListener('keydown', function(event) {
        if (event.key !== 'Tab') return;
        
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });
    
    firstElement.focus();
}

/**
 * Update dynamic content for screen readers
 * @param {string} regionId - The ID of the content region
 * @param {string} content - The new content
 */
function updateAccessibleContent(regionId, content) {
    const region = document.getElementById(regionId);
    
    if (region) {
        region.textContent = '';
        setTimeout(() => {
            region.textContent = content;
        }, 100);
    }
}

/**
 * Check color contrast compliance
 * @param {string} foregroundColor - Foreground color hex
 * @param {string} backgroundColor - Background color hex
 * @returns {boolean} Whether contrast ratio meets WCAG AA standards
 */
function checkColorContrast(foregroundColor, backgroundColor) {
    const getLuminance = (color) => {
        const rgb = color.match(/[A-Fa-f0-9]{2}/g).map(x => parseInt(x, 16) / 255);
        const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const l1 = getLuminance(foregroundColor);
    const l2 = getLuminance(backgroundColor);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const contrast = (lighter + 0.05) / (darker + 0.05);
    
    return contrast >= 4.5;
}

// Export functions for use in other modules
export {
    initializeAccessibility,
    handleKeyboardNavigation,
    handleArrowKeyNavigation,
    handleFocusIn,
    handleFocusOut,
    handleClickAccessibility,
    announceToScreenReader,
    trapFocusInModal,
    updateAccessibleContent,
    checkColorContrast
};