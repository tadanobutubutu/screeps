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
    element.setAttribute('aria-describedby', description);
}

export function announceToScreenReader(message, priority = 'polite') {
    let announcer = document.getElementById('sr-announcer');
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'sr-announcer';
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        document.body.appendChild(announcer);
    }
    announcer.textContent = message;
    setTimeout(() => { announcer.textContent = ''; }, 1000);
}

// Focus management
export function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleKeyDown(e) {
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
    }
    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
}

// Check color contrast compliance
export function meetsContrastRequirements(foreground, background, level = 'AA') {
    const getLuminance = (color) => {
        const rgb = color.match(/\w\w/g).map(x => parseInt(x, 16) / 255);
        const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return level === 'AAA' ? ratio >= 7 : ratio >= 4.5;
}

// Skip link functionality
export function initSkipLinks() {
    const skipLink = document.querySelector('[href="#main-content"]');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('main-content') || document.querySelector('main');
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }
}

// Initialize accessibility features
export function initAccessibility() {
    initSkipLinks();
    document.body.classList.add('accessibility-ready');
}

// Export version for compatibility
export const VERSION = '1.0.0';
export { announceToScreenReader as ariaAnnounce };