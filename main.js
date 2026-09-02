import React from 'react';

// Import content generators from separate modules
const { dependencyGraphContent, indexContent } = require('./contentGenerators');

const {
    createInPageButton,
    validateTableStructure,
    validateLandmarkStructure,
    getLangAttribute,
    validateAccessibilityReport,
    handleKeyboardNav,
    newFocusTrap,
    exportUtils,
    addressAccessibilityIssues,
    handleCredentialResponse,
    ensureElementId: ensureElementIdOrigin,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    renderAdditionalContent,
    transformInputData
} = main;

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/u.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u309F\u30A0-\u30FF]/u.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04FF]/u.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06FF]/u.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôùûüÿæœ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return lang;
}

// Function to address REACT_015: Add lang attribute to HTML element
function getHtmlLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// Import accessibility utilities
import accessibilityUtilsOrigin from './accessibilityUtils';

/**
 * Validates table accessibility and checks for proper structure
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];
  const fixed = accessibilityUtilsOrigin.validateTableStructure(tableElement);

  if (!fixed.valid && !tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }
  if (!fixed.valid && !tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates landmark accessibility for REACT_017
 * @param {HTMLElement} element - The element to validate as landmark
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }

  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  if (role && !validLandmarks.includes(role.toLowerCase())) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }

  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || element.querySelector('h1, h2, h3, h4, h5, h6');

  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label or heading)');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Gets the accessible name of an SVG element for REACT_041
 * @param {SVGElement} svgElement - The SVG element
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }

  // Check for aria-label
  const accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;

  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }

  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  return null;
}

/**
 * Ensures unique landmarks in the document (main should be unique)
 * @returns {Object} Validation result with valid flag and errors array
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  const errors = [];
  const landmarkCounts = {};

  // Count landmarks by role or tag
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const identifier = landmark.tagName.toLowerCase() || landmark.getAttribute('role');

    // main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkCounts[identifier]) {
        errors.push(`Duplicate main landmark found. Only one main landmark should exist.`);
      } else {
        landmarkCounts[identifier] = 1;
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validates SVG accessibility by checking for accessible names
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateSvgAccessibility() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }

  const errors = [];
  const svgs = document.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      errors.push(`SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Gets the accessible name of an interactive element
 * @param {HTMLElement} element - The interactive element
 * @returns {string} The accessible name or empty string
 */
function personName(element) {
  if (typeof document === 'undefined' || !element) {
    return '';
  }

  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  // Check for aria-labelledby
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement && labelElement.textContent.trim()) {
      return labelElement.textContent.trim();
    }
  }

  // Check for visible text content
  const textContent = element.textContent;
  if (textContent && textContent.trim()) {
    return textContent.trim();
  }

  // Check for associated label (for form elements)
  if (element.id) {
    const labels = document.querySelectorAll(`label[for="${element.id}"]`);
    if (labels.length > 0 && labels[0].textContent.trim()) {
      return labels[0].textContent.trim();
    }
  }

  return '';
}

/**
 * Validates links and interactive elements for accessible names
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateLinks() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }

  const errors = [];
  const links = document.querySelectorAll('a, button, [role="link"], [role="button"]');

  links.forEach((el, index) => {
    const name = personName(el);
    if (!name || !name.trim()) {
      errors.push(`Interactive element ${index + 1} is missing an accessible name`);
    }
  });

  return { valid: errors.length === 0, errors };
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

        return () => {
            element.removeEventListener('keydown', handleKeyboard);
        };
    },

    /**
     * Upgrade old accessibility patterns to modern best practices
     */
    upgradeAccessibility() {
        // Implement upgrading old accessibility patterns to modern best practices
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
    handleKeyboardNav(e, options) {
        const key = e.key;
        if (options[key]) {
            options[key](e);
        }
    },

    /**
     * Ensure an element has an ID for accessibility purposes
     * @param {HTMLElement} element - The element to ensure has an ID
     * @returns {HTMLElement} The element with an ID
     */
    ensureElementId: function (element) {
        if (element && !element.id) {
            element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        return element;
    },

    // Re-export validation functions
    validateTableAccessibility,
    validateLandmark,
    validateSvgAccessibility,
    ensureUniqueLandmarks,
    personName,
    validateLinks
};

function generateAccessibilityReport(container) {
    // TODO: Implement function for generating a report based on accessibility issues
    // Replaced placeholder with full implementation using axe-core scanning and report writing
    
    const report = {
        timestamp: new Date().toISOString(),
        issues: [],
        summary: {
            critical: 0,
            serious: 0,
            moderate: 0,
            minor: 0
        }
    };
    
    if (typeof axe !== 'undefined' && container) {
        axe.run(container, (err, results) => {
            if (err) {
                console.error('Accessibility scan error:', err);
                return report;
            }
            
            results.violations.forEach(violation => {
                violation.nodes.forEach(node => {
                    report.issues.push({
                        id: violation.id,
                        impact: violation.impact,
                        description: violation.description,
                        help: violation.helpUrl,
                        element: node.html,
                        selector: node.target.join(', ')
                    });
                    
                    if (violation.impact === 'critical') report.summary.critical++;
                    else if (violation.impact === 'serious') report.summary.serious++;
                    else if (violation.impact === 'moderate') report.summary.moderate++;
                    else report.summary.minor++;
                });
            });
            
            if (typeof fs !== 'undefined' && fs.writeFileSync) {
                try {
                    fs.writeFileSync('accessibility-report.json', JSON.stringify(report, null, 2));
                } catch (writeErr) {
                    console.error('Failed to write report file:', writeErr);
                }
            }
        });
    }
    
    return report;
}

function getConfig() {
    return { ...appData.config };
}

function setConfig(config) {
    appData.config = { ...appData.config, ...config };
}

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph');

if (dependencyGraph) {
    // Set appropriate ARIA role for the dependency graph container
    // Using 'region' role for a contained section of content
    if (!dependencyGraph.getAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
    }

    // Add accessible label if not already present
    if (!dependencyGraph.getAttribute('aria-label')) {
        dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }
}

export { 
    accessibilityUtils, 
    validateTableAccessibility, 
    validateLandmark, 
    validateSvgAccessibility, 
    ensureUniqueLandmarks,
    setHtmlLangAttribute,
    detectAndSetLang,
    getHtmlLangAttribute,
    generateAccessibilityReport,
    getConfig,
    setConfig
};