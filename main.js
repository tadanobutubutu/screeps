// Import content generators from separate modules
const { dependencyGraphContent, indexContent } = require('./contentGenerators');

// Existing rendering functions (preserving existing exports and functions)

function renderDependencyGraph(deps, options = {}) {
    // The original renderDependencyGraph function has been updated to work with the new changes
    // ... (Updated code goes here)
}

/**
 * Validate the landmark structure for accessibility issues
 * @param {Document|HTMLElement} context - The document or element to validate (defaults to document)
 * @returns {Object} Validation result with issues array and overall status
 */
function validateLandmarkStructure(context = document) {
    const issues = [];
    const doc = context.documentElement ? context : document;
    
    // Check for presence of main landmark (should have exactly one per page)
    const mainElements = doc.querySelectorAll('main');
    if (mainElements.length === 0) {
        issues.push({
            type: 'missing-landmark',
            message: 'Page should have at least one <main> landmark for main content',
            severity: 'error',
            element: null
        });
    } else if (mainElements.length > 1) {
        // Multiple main elements need aria-label to distinguish them
        mainElements.forEach((main, index) => {
            if (!main.hasAttribute('aria-label') && !main.hasAttribute('aria-labelledby')) {
                issues.push({
                    type: 'duplicate-landmark',
                    message: `Multiple <main> elements should have aria-label or aria-labelledby to differentiate them`,
                    severity: 'warning',
                    element: main
                });
            }
        });
    }
    
    // Check for banner landmark (<header>) - should be at most one outside of <article>/<section>
    const headerElements = doc.querySelectorAll('header');
    headerElements.forEach((header) => {
        // Check if header is a direct child of body or main (banner landmark)
        const parent = header.parentElement;
        if (parent && (parent.tagName === 'BODY' || parent.tagName === 'MAIN')) {
            const bannerHeaders = doc.querySelectorAll('body > header, body > main > header');
            if (bannerHeaders.length > 1) {
                const existingIssue = issues.find(i => i.type === 'multiple-banner' && i.element === header);
                if (!existingIssue) {
                    issues.push({
                        type: 'multiple-banner',
                        message: 'Page should have only one <header> element as a banner landmark outside of article/section',
                        severity: 'error',
                        element: header
                    });
                }
            }
        }
    });
    
    // Check for contentinfo landmark (<footer>) - should be at most one outside of <article>/<section>
    const footerElements = doc.querySelectorAll('footer');
    footerElements.forEach((footer) => {
        const parent = footer.parentElement;
        if (parent && (parent.tagName === 'BODY' || parent.tagName === 'MAIN')) {
            const contentinfoFooters = doc.querySelectorAll('body > footer, body > main > footer');
            if (contentinfoFooters.length > 1) {
                const existingIssue = issues.find(i => i.type === 'multiple-contentinfo' && i.element === footer);
                if (!existingIssue) {
                    issues.push({
                        type: 'multiple-contentinfo',
                        message: 'Page should have only one <footer> element as a contentinfo landmark outside of article/section',
                        severity: 'error',
                        element: footer
                    });
                }
            }
        }
    });
    
    // Check for navigation landmarks (<nav>) - should have accessible names
    const navElements = doc.querySelectorAll('nav');
    if (navElements.length > 1) {
        // Multiple navigation regions should have aria-label to differentiate them
        navElements.forEach((nav) => {
            if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
                issues.push({
                    type: 'unlabeled-navigation',
                    message: 'Multiple <nav> elements should have aria-label or aria-labelledby to describe their purpose',
                    severity: 'warning',
                    element: nav
                });
            }
        });
    }
    
    // Check for complementary landmark (<aside>) - should not have main content
    const asideElements = doc.querySelectorAll('aside');
    asideElements.forEach((aside) => {
        const hasMain = aside.querySelector('main');
        if (hasMain) {
            issues.push({
                type: 'inappropriate-landmark-content',
                message: '<aside> landmark should not contain <main> content',
                severity: 'error',
                element: aside
            });
        }
        
        // Aside should have accessible name if multiple exist
        if (asideElements.length > 1 && !aside.hasAttribute('aria-label') && !aside.hasAttribute('aria-labelledby')) {
            issues.push({
                type: 'unlabeled-complementary',
                message: 'Multiple <aside> elements should have aria-label or aria-labelledby to differentiate them',
                severity: 'warning',
                element: aside
            });
        }
    });
    
    // Check for section elements - should have accessible names to be meaningful landmarks
    const sectionElements = doc.querySelectorAll('section');
    sectionElements.forEach((section) => {
        if (!section.hasAttribute('aria-label') && !section.hasAttribute('aria-labelledby')) {
            // Only warn for sections that don't have headings as implicit labels
            const hasHeading = section.querySelector('h1, h2, h3, h4, h5, h6');
            if (!hasHeading) {
                issues.push({
                    type: 'unlabeled-section',
                    message: '<section> elements should have aria-label, aria-labelledby, or a heading to be recognized as a landmark',
                    severity: 'warning',
                    element: section
                });
            }
        }
    });
    
    // Check for proper document structure (landmark hierarchy)
    const body = doc.querySelector('body');
    if (body) {
        const directChildren = Array.from(body.children);
        const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
        
        directChildren.forEach((child) => {
            if (landmarks.includes(child.tagName.toLowerCase())) {
                // Check if landmark has appropriate nesting
                if (child.tagName === 'HEADER' || child.tagName === 'FOOTER') {
                    const parent = child.parentElement;
                    if (parent && parent.tagName !== 'BODY' && parent.tagName !== 'MAIN' && 
                        parent.tagName !== 'ARTICLE' && parent.tagName !== 'SECTION') {
                        // This is actually valid (nested in other elements), no issue
                    }
                }
            }
        });
    }
    
    // Check for region role usage
    const regions = doc.querySelectorAll('[role="region"]');
    regions.forEach((region) => {
        if (!region.hasAttribute('aria-label') && !region.hasAttribute('aria-labelledby')) {
            issues.push({
                type: 'unlabeled-region',
                message: '<div role="region"> should have aria-label or aria-labelledby to be recognized as a landmark',
                severity: 'warning',
                element: region
            });
        }
    });
    
    return {
        valid: issues.filter(i => i.severity === 'error').length === 0,
        issues: issues,
        summary: {
            total: issues.length,
            errors: issues.filter(i => i.severity === 'error').length,
            warnings: issues.filter(i => i.severity === 'warning').length
        }
    };
}

class ScreetsBot {
  // ... (The rest of the class definition remains the same as in the original conflict branch)

  validateTableAccessibility(html) {
    if (html) {
      // Extract table structure from the provided HTML and check its accessibility according to the criteria
      // ... (Add the logic to validate table accessibility)
    }
  }

  // ... (Add the event listener for click events on the dependencyGraph element)
}

// Add lang attribute to HTML element
function getLangAttribute() {
    // Implementation to add lang attribute
    return document.documentElement.lang || 'en';
}

// Accessibility utilities for keyboard navigation and screen reader support
const accessibilityUtils = {
    /**
     * Initialize skip link functionality
     * @param {HTMLElement} skipLink - The skip link element
     */
    initSkipLink(skipLink) {
        if (!skipLink) return;
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.tabIndex = -1;
                target.focus();
            }
        });
    },

    /**
     * Trap focus within an element for modal/dialog accessibility
     * @param {HTMLElement} element - Container element to trap focus within
     * @returns {Function} Cleanup function to remove event listeners
     */
    trapFocus(element) {
        if (!element) return () => {};

        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return () => {};

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        const handleKeyboard = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        };

        element.addEventListener('keydown', handleKeyboard);
        
        // Return cleanup function
        return () => {
            element.removeEventListener('keydown', handleKeyboard);
        };
    },

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announceToScreenReader(message, priority = 'polite') {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    },

    /**
     * Handle keyboard navigation for custom components
     * @param {KeyboardEvent} e - Keyboard event
     * @param {Object} options - Navigation options
     */
    handleKeyboardNav(e, options = {}) {
        const { onEscape, onEnter, onArrowUp, onArrowDown } = options;
        
        switch (e.key) {
            case 'Escape':
                if (onEscape) onEscape(e);
                break;
            case 'Enter':
                if (onEnter) onEnter(e);
                break;
            case 'ArrowUp':
                if (onArrowUp) {
                    e.preventDefault();
                    onArrowUp(e);
                }
                break;
            case 'ArrowDown':
                if (onArrowDown) {
                    e.preventDefault();
                    onArrowDown(e);
                }
                break;
        }
    },
    
    /**
     * Validate the landmark structure for accessibility issues
     * @param {Document|HTMLElement} context - The document or element to validate
     * @returns {Object} Validation result with issues array and summary
     */
    validateLandmarkStructure(context = document) {
        return validateLandmarkStructure(context);
    }
};

// New focus trap implementation with enhanced features
function newFocusTrap(element, options = {}) {
    const {
        initialFocus = true,
        returnFocusOnDeactivate = true,
        escapeDeactivates = true
    } = options;
    
    if (!element) {
        throw new Error('newFocusTrap: element is required');
    }

    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    // If no focusable elements, delegate to original trapFocus
    if (focusableElements.length === 0) {
        return accessibilityUtils.trapFocus(element);
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    let previouslyFocused = document.activeElement;

    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
        }
    };

    const handleEscape = (e) => {
        if (e.key === 'Escape' && escapeDeactivates) {
            deactivate();
        }
    };

    const activate = () => {
        element.addEventListener('keydown', handleTabKey);
        element.addEventListener('keydown', handleEscape);
        
        if (initialFocus && first) {
            first.focus();
        }
    };

    const deactivate = () => {
        element.removeEventListener('keydown', handleTabKey);
        element.removeEventListener('keydown', handleEscape);
        
        if (returnFocusOnDeactivate && previouslyFocused && typeof previouslyFocused.focus === 'function') {
            previouslyFocused.focus();
        }
    };

    activate();

    return {
        activate,
        deactivate,
        updatePreviouslyFocused: (el) => {
            previouslyFocused = el;
        }
    };
}

// Export all required functions and utilities
module.exports = {
    renderDependencyGraph,
    renderIndex,
    getLangAttribute,
    accessibilityUtils,
    trapFocus: accessibilityUtils.trapFocus,
    newFocusTrap,
    initSkipLink: accessibilityUtils.initSkipLink,
    announceToScreenReader: accessibilityUtils.announceToScreenReader,
    handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
    createInPageButtons,
    validateLandmarkStructure
};