import React from 'react';

// Utility functions for accessibility
const accessibilityUtils = {
    // Initialize skip link functionality for keyboard navigation
    initSkipLink: () => {
        const skipLink = document.querySelector('#skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        }
    },

    // Trap focus within an element (for modals, dialogs)
    trapFocus: (element) => {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    },

    // Announce message to screen readers
    announceToScreenReader: (message, priority = 'polite') => {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        setTimeout(() => announcer.remove(), 1000);
    },

    // Handle keyboard navigation
    handleKeyboardNav: (e, handlers) => {
        const key = e.key;
        if (handlers[key]) {
            handlers[key](e);
        }
    },
};

// Screeps Bot class
class ScreepsBot {
    constructor() {
        this.network = null;
        this.tasks = [];
        this.config = {};
    }

    async start() {
        await this.network.connect();
        await this.loadData();
        console.log('Screenspider bot started');
    }

    loadData() {
        // Placeholder for data loading logic
    }

    setElementLabel(elementId, label) {
        const el = document.getElementById(elementId);
        if (el) {
            el.setAttribute('aria-label', label);
            el.setAttribute('role', 'button');
        }
    }

    addTaskWithPriority(taskFn, priority = 'medium') {
        this.tasks.push({ task: taskFn, priority });
        this.scheduleTasks();
    }

    scheduleTasks() {
        this.tasks.sort((a, b) => {
            const prioOrder = { high: 0, medium: 1, low: 2 };
            return prioOrder[b.priority] - prioOrder[a.priority];
        });

        if (this.tasks.length > 0) {
            const nextTask = this.tasks[0];
            try {
                nextTask.task();
            } catch (err) {
                console.error(`Task failed: ${err.message}`);
            }
        }
    }
}

const main = require('./utilities');

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
    ensureElementId,
    ensureElementHasId,
    ensureElementHasIdOrigin,
    addAriaLabel: addAriaLabelImported,
    renderDependencyGraph: renderDependencyGraphImported,
} = main;

function newFocusTrap() {
    // New function implementation: traps focus within a given element
    return (element) => {
        if (!element) return;
        const focusable = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        });
    };
}

function addLangAttribute() {
    document.documentElement.setAttribute('lang', 'en');
}

/**
 * Adds an aria-label attribute to an element.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement} The element with the aria-label added
 */
function addAriaLabel(element, label) {
    if (!element) {
        return element;
    }

    if (typeof label !== 'string' || label.trim() === '') {
        return element;
    }

    element.setAttribute('aria-label', label);
    return element;
}

/**
 * Ensures an element has both an id and an aria-label for accessibility.
 * @param {HTMLElement} element - The element to enhance
 * @param {string} idPrefix - The prefix for generating an id if needed
 * @param {string} ariaLabel - The aria-label text
 * @returns {string|null} The id of the element, or null if element is invalid
 */
function ensureElementAccessibility(element, idPrefix, ariaLabel) {
    if (!element) {
        return null;
    }

    const id = ensureElementHasId(element, idPrefix);
    addAriaLabel(element, ariaLabel);

    return id;
}

// Sample main.js with dependencyGraph container
function renderDependencyGraph() {
    const container = document.getElementById('dependency-graph');

    if (container) {
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Dependency graph visualization');

        // Ensure the container has an id for accessibility
        ensureElementHasId(container, 'dep-graph');
    }
}

function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9_.-]/gi, '_');
}

function readFileSafe(filePath) {
    try {
        return require('fs').readFileSync(filePath, 'utf8');
    } catch (error) {
        log(`Error reading file ${filePath}: ${error.message}`, 'error');
        return null;
    }
}

function addMainLandmark() {
    const mainElement = document.createElement('main');
    document.body.appendChild(mainElement);
}

function fixLandmarkIssues() {
    // Hypothetical code to fix landmark issues
    // This is a placeholder function
}

function addSvgAccessibleNames() {
    // Hypothetical code to add accessible names to SVGs
    // This is a placeholder function
}

function addAccessibleNamesToSVGs() {
    // Hypothetical code to add accessible names to SVGs
    // This is a placeholder function
}

function fixFakeLinkIssue() {
    // Hypothetical code to fix a fake link issue
    // This is a placeholder function
}

function googleSignIn() {
    // Hypothetical code for Google sign-in logic
    // This is a placeholder function
}

function fixButtonIdentifiers() {
    // Hypothetical code to replace 'my-button' with actual button id for accessibility
    // This is a placeholder function
}

// Existing data processing functions (merged from HEAD and origin/main)
function processData(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map((item) => ({
        ...item,
        processed: true,
        timestamp: Date.now(),
    }));
}

/**
 * Handle credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Result of handling the credential
 */
function handleCredentialResponse(credentialResponse) {
    const parsedResponse = parseCredentialResponse(credentialResponse);

    if (!parsedResponse) {
        return { status: 'error', message: 'Failed to parse credential response' };
    }

    if (parsedResponse.success === false) {
        return { status: 'error', message: parsedResponse.error };
    }

    return {
        status: 'success',
        credential: parsedResponse
    };
}

/**
 * Validate table structure for accessibility
 * @param {HTMLElement} table
 * @returns {boolean}
 */
function validateTableStructure(table) {
    if (!table || table.tagName !== 'TABLE') return false;

    const hasHeader = table.querySelector('thead') !== null;
    const headerCells = table.querySelectorAll('th').length;
    const hasCaption = table.querySelector('caption') !== null;
    const headersWithScope = table.querySelectorAll('th[scope]').length;

    return hasHeader && headerCells > 0 && (hasCaption || headersWithScope > 0);
}

/**
 * Get the language attribute for an element or document.
 * @param {HTMLElement} [element] - Element to check; defaults to documentElement
 * @returns {string} The lang attribute value or 'en' as fallback
 */
function getLangAttribute(element) {
    if (typeof document === 'undefined') return 'en';
    const target = element || document.documentElement;
    return target.getAttribute('lang') || 'en';
}

/**
 * Create an in-page button for navigation
 * @param {string} label - Button label
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement|null}
 */
function createInPageButton(label, onClick) {
    if (typeof document === 'undefined') return null;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    if (typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }
    return button;
}

/**
 * Validate the accessibility of a table
 * @param {HTMLElement} table
 * @returns {boolean}
 */
function validateTableAccessibility(table) {
    return validateTableStructure(table);
}

/**
 * Set SVG accessibility attributes
 * @param {SVGElement} svg
 */
function setSvgAttributes(svg) {
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
        titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
    }
    if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
    }
    svg.setAttribute('aria-labelledby', titleElement.id);
    if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
    }
}

/**
 * Get accessible name for SVG element
 * @param {SVGElement} svg
 * @returns {string}
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    const title = svg.querySelector('title');
    if (title && title.textContent) {
        return title.textContent;
    }
    return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

/**
 * Validate link accessibility
 * @param {HTMLElement} link
 * @returns {boolean}
 */
function validateLinkAccessibility(link) {
    if (!link) return false;
    const hasHref = link.hasAttribute('href');
    const isAnchor = link.tagName === 'A';
    const hasAriaLabel = link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby');
    const hasText = (link.textContent || '').trim().length > 0;
    return isAnchor && hasHref && (hasAriaLabel || hasText);
}

/**
 * Handle fake links in the document
 */
function handleFakeLinks() {
    a11yStore.fixFakeLinks();
}

/**
 * Wrap primary content in a main element for accessibility
 */
function wrapPrimaryContentInMain() {
    if (typeof document === 'undefined') return;
    const main = document.querySelector('main');
    if (!main) {
        const mainEl = document.createElement('main');
        mainEl.id = 'main-content';
        while (document.body.firstChild) {
            mainEl.appendChild(document.body.firstChild);
        }
        document.body.appendChild(mainEl);
    }
}

/**
 * Check landmarks for uniqueness and add labels
 */
function checkLandmarks() {
    a11yStore.checkLandmarkElements();
}

/**
 * Ensure landmark elements have unique IDs
 */
function ensureUniqueLandmarks() {
    if (typeof document === 'undefined') return;
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside');
    const idCounts = {};

    landmarks.forEach((landmark) => {
        const tag = landmark.tagName.toLowerCase();
        idCounts[tag] = (idCounts[tag] || 0) + 1;
        if (!landmark.id || landmark.id === '') {
            landmark.id = `${tag}-${idCounts[tag]}`;
        }
    });
}

/**
 * Add proper landmark regions to the document
 */
function addProperLandmarkRegions() {
    wrapPrimaryContentInMain();
    ensureUniqueLandmarks();
}

/**
 * Check if an element is a landmark element for accessibility
 * Landmark elements include: main, nav, aside, header, footer, section, article, form, search
 * @param {HTMLElement|string} element - The element or element tag name to check
 * @returns {boolean} True if the element is a landmark element
 */
function isLandmarkElement(element) {
    const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form', 'search'];

    if (!element) {
        return false;
    }

    if (typeof element === 'string') {
        return landmarkTags.includes(element.toLowerCase());
    }

    if (element.tagName) {
        return landmarkTags.includes(element.tagName.toLowerCase());
    }

    return false;
}

/**
 * Parse a credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Parsed response with success status and credential or error
 */
function parseCredentialResponse(credentialResponse) {
    try {
        if (!credentialResponse || !credentialResponse.credential) {
            return {
                success: false,
                error: 'Invalid credential response'
            };
        }
        const parts = credentialResponse.credential.split('.');
        if (parts.length !== 3) {
            return {
                success: false,
                error: 'Malformed credential token'
            };
        }
        const payload = parts[1];
        const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
        return JSON.parse(decoded);
    } catch (error) {
        return null;
    }
}

/**
 * Sanitize a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9_.-]/gi, '_');
}

/**
 * Helper function for UI updates with accessibility
 * @param {string} elementId - Element ID to update
 * @param {string} text - Text content to set
 */
function updateUI(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        element.setAttribute('aria-live', 'polite');
    }
}

function filterValidItems(items, validator) {
    return items.filter((item) => {
        try {
            return validator(item);
        } catch {
            return false;
        }
    });
}

function groupByCategory(items, getCategory) {
    return items.reduce((groups, item) => {
        const category = getCategory(item);
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});
}

// Initialize accessibility features (merged from HEAD and origin/main)
const initAccessibility = () => {
    accessibilityUtils.initSkipLink();

    // Add keyboard support for all interactive elements
    document.querySelectorAll('[data-accessible]').forEach((element) => {
        element.addEventListener('keydown', (e) => {
            accessibilityUtils.handleKeyboardNav(e, {
                Enter: () => element.click(),
                ' ': () => element.click(),
            });
        });
    });
};

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd

// Initialize on DOM ready (merged from HEAD and origin/main)
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibility);
    } else {
        initAccessibility();
    }
}

// Export all utilities (merged from HEAD and origin/main)
module.exports = {
    accessibilityUtils
};