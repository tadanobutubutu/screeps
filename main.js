/**
 * Main application JavaScript
 * Addresses accessibility issues from insight report
 */

// Node.js utilities (for build-time/report processing)
let utilities = null;
try {
    utilities = require('./utilities');
} catch (e) {
    // Utilities not available in browser environment
}

const {
    createInPageButton,
    createWebResourceButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    exportUtils,
    addressAccessibilityIssues,
    handleCredentialResponse,
    ensureElementHasId,
    ensureElementHasIdOrigin,
    addAriaLabel,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    checkAccessibility: utilCheckAccessibility
} = utilities || {};

// Simple logger for Node.js environment
function log(message, level = 'info') {
    const prefix = level === 'error' ? '[ERROR]' : level === 'warn' ? '[WARN]' : '[INFO]';
    if (typeof console !== 'undefined') {
        console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](`${prefix} ${message}`);
    }
}

// Track current focus for restoration (browser runtime)
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

/**
 * Implements accessibility fixes from an insight report
 * @param {HTMLElement|Document} container - The container element to fix
 * @param {Object} report - The accessibility report with issues
 * @returns {Object} Summary of fixes applied
 */
function implementAccessibilityFixesFromReport(container, report) {
    const fixes = {
        langAdded: false,
        mainLandmarkAdded: false,
        landmarksFixed: 0,
        svgNamesAdded: 0,
        fakeLinksFixed: 0
    };

    if (!report || !report.issues) {
        return fixes;
    }

    // Add lang attribute to HTML element if missing
    const htmlEl = container.querySelector('html') || (container.ownerDocument && container.ownerDocument.querySelector('html'));
    if (htmlEl && !htmlEl.hasAttribute('lang')) {
        htmlEl.setAttribute('lang', 'en');
        fixes.langAdded = true;
    }

    // Add main landmark if missing
    const mainElement = container.querySelector('main');
    if (!mainElement) {
        const body = container.querySelector('body');
        if (body) {
            const newMain = document.createElement('main');
            while (body.firstChild) {
                newMain.appendChild(body.firstChild);
            }
            body.appendChild(newMain);
            fixes.mainLandmarkAdded = true;
        }
    }

    // Use utility functions if available (Node.js/build-time)
    if (typeof renderDependencyGraphs === 'function') {
        renderDependencyGraphs(container);
    }
    if (typeof fixButtonIdentifiers === 'function') {
        fixButtonIdentifiers(container);
    }
    if (typeof fixDependencyGraphAria === 'function') {
        fixDependencyGraphAria(container);
    }
    if (typeof addMainLandmarkToIndex === 'function') {
        addMainLandmarkToIndex(container);
    }

    // Fix landmark issues using utilities if available
    if (typeof validateLandmark === 'function') {
        validateLandmark(container);
    }
    if (typeof validateLandmarkStructure === 'function') {
        validateLandmarkStructure(container);
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
        let accessibleName = '';
        if (typeof getSvgAccessibleName === 'function') {
            accessibleName = getSvgAccessibleName(svg);
        } else {
            // Fallback: try to get name from title/desc
            const title = svg.querySelector('title');
            const desc = svg.querySelector('desc');
            accessibleName = title?.textContent || desc?.textContent || '';
        }
        if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
            svg.setAttribute('aria-label', accessibleName);
            fixes.svgNamesAdded++;
        }
    });

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll('a:not([href])');
    fakeLinks.forEach(link => {
        link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`));
        link.setAttribute('role', 'link');
        fixes.fakeLinksFixed++;
    });

    // Validate accessibility report using utility if available
    if (typeof validateAccessibilityReport === 'function') {
        const validationReport = validateAccessibilityReport(container);
        if (validationReport && validationReport.length > 0) {
            log(`Accessibility report contains ${validationReport.length} remaining issues`, 'warn');
        }
    }

    // Implement focus trap for keyboard navigation
    if (typeof focusTrap === 'function') {
        focusTrap(container);
    } else if (typeof trapFocus === 'function') {
        // Fallback to browser runtime trapFocus
        trapFocus(container);
    }

    if (fixes.langAdded) {
        log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
        log('Main landmark added', 'info');
    }

    // Check for new accessibility issues
    const newAccessibilityIssues = checkAccessibility(container);
    if (newAccessibilityIssues.length > 0) {
        log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`, 'error');
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
        log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
        log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
        log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
    }

    return fixes;
}

// Accessibility-related function to be added
function checkAccessibility(content) {
    // Use utility function if available (Node.js/build-time)
    if (typeof utilCheckAccessibility === 'function') {
        return utilCheckAccessibility(content);
    }
    
    // Browser runtime fallback: basic checks
    const issues = [];
    
    // Check for missing lang attribute
    const htmlEl = content.querySelector('html') || (content.ownerDocument && content.ownerDocument.querySelector('html'));
    if (htmlEl && !htmlEl.hasAttribute('lang')) {
        issues.push('Missing lang attribute on HTML element');
    }
    
    // Check for missing main landmark
    if (!content.querySelector('main')) {
        issues.push('Missing main landmark');
    }
    
    // Check for images without alt text
    content.querySelectorAll('img:not([alt])').forEach(img => {
        issues.push(`Image missing alt attribute: ${img.src || img.outerHTML.substring(0, 50)}`);
    });
    
    // Check for form inputs without labels
    content.querySelectorAll('input, select, textarea').forEach(input => {
        const label = content.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            issues.push(`Form element missing label: ${input.id || input.type}`);
        }
    });
    
    // Check for buttons without accessible names
    content.querySelectorAll('button').forEach(button => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            issues.push('Button missing accessible name');
        }
    });
    
    return issues;
}

// Initialize accessibility features on DOM ready (browser runtime)
if (typeof document !== 'undefined' && document.addEventListener) {
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
}

// Export functions for use elsewhere (works in both Node.js and browser)
const exports = {
    // Browser runtime accessibility utilities
    trapFocus,
    announceToScreenReader,
    openModal,
    closeModal,
    updateAccessibleInteractiveElements,
    // Build-time/report processing functions
    implementAccessibilityFixesFromReport,
    checkAccessibility
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
}

// Also expose globally for browser usage
if (typeof window !== 'undefined') {
    window.accessibilityUtils = exports;
}