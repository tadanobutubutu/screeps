import React, { useEffect } from 'react';

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
    ensureElementHasId,
    ensureElementHasIdOrigin,
    addAriaLabel,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    checkAccessibility,
} = main;

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
    let lang = 'en'; // Default to English

    if (content) {
        // Simple language detection based on common patterns
        if (content) {
            if (/[\u4e00-\u9fff]/.test(content)) {
                lang = 'zh'; // Chinese
            } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
                lang = 'ja'; // Japanese
            } else if (/[\u0400-\u04ff]/.test(content)) {
                lang = 'ru'; // Russian/Cyrillic
            } else if (/[\u0600-\u06ff]/.test(content)) {
                lang = 'ar'; // Arabic
            } else if (/[éèêàâïîôùûüç]/i.test(content)) {
                lang = 'fr'; // French
            } else if (/[äöüß]/i.test(content)) {
                lang = 'de'; // German
            }
        }

        useEffect(() => {
            setHtmlLangAttribute(lang);
        }, [lang]);

        return lang;
    }

    return 'en';
}

/**
 * Gets the current lang attribute from the document's <html> element
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
    if (typeof document !== 'undefined' && document.documentElement) {
        return document.documentElement.lang || '';
    }
    return '';
}

// Assuming main.js already exports the renderDependencyGraph and renderIndexView functions
// No need to handle those conflicts here

/**
 * Utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
 * @param {Object} options - An options object with the following properties:
 *   - label (String): The button label
 *   - url (String): The button URL
 *   - icon (String|HTMLElement): An optional icon for the button (String: SVG code, HTMLElement)
 *   - iconAltText (String): The alternative text for the icon if it's an SVG
 *   - ariaLabel (String): An optional aria-label for the button
 *   - className (String): The CSS class to apply to the button
 *   - target (String): The target for the link (e.g., '_blank', '_self')
 *   - rel (String): The rel attribute for the link (e.g., 'noopener noreferrer')
 * @returns {HTMLAnchorElement} The created button element
 */
function createWebResourceButton(options = {}) {
    const {
        label,
        url,
        icon = null,
        iconAltText = '',
        ariaLabel = null,
        className = 'web-resource-btn',
        target = '_blank',
        rel = 'noopener noreferrer',
    } = options;

    const button = document.createElement('a');
    button.href = url;
    button.className = className;
    button.target = target;
    button.rel = rel;

    // Set accessible name - prefer explicit ariaLabel, fallback to label
    const accessibleName = ariaLabel || label;
    button.setAttribute('aria-label', accessibleName);

    // Add text content
    if (label) {
        button.textContent = label;
    }

    // Handle icon accessibility
    if (icon) {
        if (typeof icon === 'string') {
            // If icon is an SVG string
            button.insertAdjacentHTML('beforebegin', icon);
            const svg = button.querySelector('svg');
            if (svg) {
                svg.setAttribute('aria-hidden', 'true');
                if (iconAltText) {
                    svg.setAttribute('aria-label', iconAltText);
                }
            }
        } else if (icon instanceof HTMLElement) {
            // If icon is already an DOM element
            icon.setAttribute('aria-hidden', 'true');
            button.insertBefore(icon, button.firstChild);
        }
    }

    return button;
}

module.exports = {
    detectAndSetLang,
    getLangAttribute,
    createWebResourceButton,
};
