/**
 * Main JavaScript module with accessibility improvements
 * Addressed accessibility issues from insight report — FIXED (combined with the export code)
 */

// Accessibility utilities
export function getAccessibleName(element) {
    if (!element) return '';
    return element.getAttribute('aria-label') || element.textContent?.trim() || '';
}

export function setAccessibleDescription(element, description) {
    if (!element) return;
    ... description);
}

export function announceToScreenReader(message, priority = 'polite') {
    let announcer = ...
    if (!announcer) {
        announcer = ...
        announcer.id = 'sr-announcer';
        ... priority);
        ... 'true');
        announcer.className = 'sr-only';
        announcer.style.cssText = ...
        ...
    }
    announcer.textContent = message;
    setTimeout(() => { announcer.textContent = ''; }, 1000);
}

// Focus management
export function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], ... ... ... ... ...
    );
    const firstElement = ...
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleKeyDown(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                ...
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                ...
            }
        }
    }
    ... handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
}

// Check color contrast compliance
export function meetsContrastRequirements(foreground, background, level = 'AA') {
    const getLuminance = (color) => {
        const rgb = ... => parseInt(x, 16) / 255);
        const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const l1 = ...
    const l2 = ...
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return level === 'AAA' ? ratio >= 7 : ratio >= 4.5;
}

// Skip link functionality
export function initSkipLinks() {
    const skipLink = ...
    if (skipLink