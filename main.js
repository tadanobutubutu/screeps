const fs = require('fs');
const main = require('./utilities');

// Import content generators from separate modules
const { dependencyGraphContent, indexContent } = require('./contentGenerators');

const {
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    announceToScreenReader,
    handleKeyboardNav,
    newFocusTrap: originNewFocusTrap,
    exportUtils,
    addressAccessibilityIssues,
    handleCredentialResponse,
    ensureElementId: ensureElementIdOrigin,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    renderAdditionalContent,
    transformInputData
} = main;

// Existing rendering functions (preserving existing exports and functions)

const dependencyGraph = document.getElementById('dependencyGraph')

if (dependencyGraph) {
  // Set appropriate ARIA role for the dependency graph container
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region')
  }

  // Ensure element has an ID if not present
  if (!dependencyGraph.getAttribute('id')) {
    dependencyGraph.setAttribute('id', 'dependencyGraph');
  }

  // Add accessible label if not already present
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization')
  }
}

function addAccessibleName (svgString) {
  const parser = new DOMParser()
  const svg = parser.parseFromString(svgString, 'image/svg+xml')
  const svgElement = svg.documentElement
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG')
  }
  const serializer = new XMLSerializer()
  return serializer.serializeToString(svg)
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
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
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

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementIdLocal = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

function addAriaLabel(element, label) {
    if (element) {
        element.setAttribute('aria-label', label);
    }
}

function addAccessibleName(element, name) {
    if (element) {
        element.setAttribute('aria-label', name);
    }
}

function ensureElementHasId(element) {
    return ensureElementIdLocal(element);
}

function getTables() {
    // Implementation for getting tables
    return document.querySelectorAll('table');
}

function getConfig() {
    // Implementation for getting config
    return {};
}

function setConfig(config) {
    // Implementation for setting config
}

// Harvest logic implementation
function harvest() {
    // Example harvest logic
    console.log('Harvesting resources...');
    return 'harvested';
}

function createInPageButtons() {
    // Implementation for creating in-page buttons
}

function renderDependencyGraph() {
    // Implementation for rendering dependency graph
}

function renderIndex() {
    // Implementation for rendering index
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
    addAriaLabel,
    addAccessibleName,
    validateTableAccessibility,
    validateTableStructure,
    ensureElementId: ensureElementIdLocal,
    ensureElementHasId,
    getTables,
    getConfig,
    setConfig,
    harvest
};