import React from 'react';

// Utility functions for accessibility
const accessibilityUtils = {
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

    announceToScreenReader: (message, priority = 'polite') => {
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        setTimeout(function() {
            announcer.remove();
        }, 1000);
    },

    handleKeyboardNav: (e, handlers) => {
        const key = e.key;
        if (handlers[key]) {
            handlers[key](e);
        }
    },

    // Get language attribute for HTML element
    getLangAttribute: () => {
        return document.documentElement.getAttribute('lang') || 'en';
    },

    // Validate table accessibility
    validateTableAccessibility: (table) => {
        // Check for proper table structure and ARIA attributes
        if (!table.querySelector('thead') || !table.querySelector('tbody')) {
            console.warn('Table missing thead or tbody');
            return false;
        }
        return true;
    },

    // Validate table structure
    validateTableStructure: (table) => {
        // Check for proper table structure
        const rows = table.querySelectorAll('tr');
        if (rows.length === 0) {
            console.warn('Table has no rows');
            return false;
        }
        return true;
    },

    // Validate landmark elements
    validateLandmark: () => {
        const landmarks = ['header', 'nav', 'main', 'footer'];
        landmarks.forEach(landmark => {
            const elements = document.querySelectorAll(landmark);
            if (elements.length > 1) {
                console.warn(`Multiple ${landmark} elements found`);
            }
        });
    },

    // Validate landmark structure
    validateLandmarkStructure: () => {
        const main = document.querySelector('main');
        if (!main) {
            console.warn('Main landmark missing');
            return false;
        }
        return true;
    },

    // Get accessible name for SVG
    getSvgAccessibleName: (svg) => {
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        if (title) return title.textContent;
        if (desc) return desc.textContent;
        return svg.getAttribute('aria-label') || 'SVG graphic';
    },

    // Create in-page button with proper accessibility attributes
    createInPageButton: (text, href) => {
        const button = document.createElement('a');
        button.textContent = text;
        button.href = href;
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        return button;
    },

    // Get person name with proper accessibility attributes
    personName: (name) => {
        const span = document.createElement('span');
        span.textContent = name;
        span.setAttribute('aria-label', name);
        return span;
    },

    // New focus trap implementation
    newFocusTrap: (element) => {
        if (!element) {
            console.warn('No element provided for focus trap');
            return;
        }

        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
            console.warn('No focusable elements found in the provided element');
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Set initial focus to first element
        firstElement.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        element.addEventListener('keydown', handleKeyDown);

        return {
            destroy: () => {
                element.removeEventListener('keydown', handleKeyDown);
            }
        };
    }
};

// New utility functions from origin/main
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', lang || 'en');
    }
    return lang || 'en';
}

function addAriaLabel(element, label) {
    if (!element) {
        return;
    }

    if (typeof label !== 'string' || label.trim() === '') {
        return element;
    }

    element.setAttribute('aria-label', label);
    return element;
}

function ensureElementAccessibility(element, idPrefix, ariaLabel) {
    if (!element) {
        return;
    }

    const id = ensureElementHasId(element, idPrefix);
    addAriaLabel(element, ariaLabel);

    return id;
}

function ensureElementHasId(element, prefix) {
    if (!element.id) {
        element.id = prefix + Math.random().toString(36).substr(2, 9);
    }
    return element.id;
}

// Credential response handling
async function handleCredentialResponse(response) {
    if (!response) {
        throw new Error('No response received');
    }

    if (response.error) {
        throw new Error(response.error);
    }

    if (response.token) {
        return {
            success: true,
            token: response.token,
            expiresIn: response.expiresIn || 3600
        };
    }

    throw new Error('Invalid credential response');
}

function addLangAttribute() {
    document.documentElement.setAttribute('lang', 'en');
}

// Export functionality with accessibility support
const exportUtils = {
    exportData: function(data, filename, mimeType) {
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.setAttribute('aria-label', 'Download ' + filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Announce download completion to screen readers
        accessibilityUtils.announceToScreenReader('Download of ' + filename + ' started');
    },

    exportToJSON: function(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
    },

    exportToCSV: function(data, filename) {
        if (!data || data.length === 0) {
            return;
        }

        const headers = Object.keys(data[0]);
        const csvRows = [];
        csvRows.push(headers.join(','));

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const values = headers.map(function(header) {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return '"' + escaped + '"';
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
    }
};

// New focus trap instance management function
let activeTraps = [];

function newFocusTrapInstance(element) {
    const trap = accessibilityUtils.newFocusTrap(element);
    activeTraps.push(trap);
    return trap;
}

function cleanupFocusTraps() {
    activeTraps.forEach(trap => {
        if (trap && typeof trap.destroy === 'function') {
            trap.destroy();
        }
    });
    activeTraps = [];
}

// Credential response handling
function handleCredentialResponseLegacy(response) {
    if (!response) {
        return { success: false, error: 'No response received' };
    }
    if (response.token) {
        return { success: true, data: response.token };
    }
    return { success: false, error: 'Invalid response' };
}

function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9.-]/gi, '_');
}

function readFileSafe(filePath) {
    try {
        return require('fs').readFileSync(filePath, 'utf8');
    } catch (error) {
        log('Error reading file ' + filePath + ': ' + error.message, 'error');
        return null;
    }
}

// Existing data processing functions
function processData(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map(function(item) {
        const result = {};
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                result[key] = item[key];
            }
        }
        result.processed = true;
        result.timestamp = Date.now();
        return result;
    });
}

function filterValidItems(items, validator) {
    return items.filter(function(item) {
        try {
            return validator(item);
        } catch (e) {
            return false;
        }
    });
}

// Initialize accessibility features
function initAccessibility() {
    accessibilityUtils.initSkipLink();

    // Add keyboard support for all interactive elements
    const elements = document.querySelectorAll('button, a, input, select, textarea');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.addEventListener('keydown', function(e) {
            accessibilityUtils.handleKeyboardNav(e, {
                Enter: function() {
                    element.click();
                },
                ' ': function() {
                    element.click();
                }
            });
        });
    }
}

function groupByCategory(items, getCategory) {
    return items.reduce(function(groups, item) {
        const category = getCategory(item);
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee3b29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// TODO: Implement the new function as per the issue requirements
function transformInputData(inputData, options) {
    if (options === undefined) {
        options = {};
    }

    const preserveKeys = options.preserveKeys !== undefined ? options.preserveKeys : true;
    const uppercase = options.uppercase === true;
    const trimWhitespace = options.trimWhitespace !== false;
    const maxLength = options.maxLength || null;

    if (!inputData) {
        return null;
    }

    let result = inputData;

    // Apply trim whitespace if needed
    if (trimWhitespace && typeof result === 'string') {
        result = result.trim();
    }

    // Apply uppercase if needed
    if (uppercase && typeof result === 'string') {
        result = result.toUpperCase();
    }

    // Apply max length if needed
    if (maxLength && typeof result === 'string' && result.length > maxLength) {
        result = result.substring(0, maxLength);
    }

    return result;
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibility);
    } else {
        initAccessibility();
    }
}

// Export all utilities
module.exports = {
    accessibilityUtils: accessibilityUtils,
    exportUtils: exportUtils,
    initAccessibility: initAccessibility,
    handleCredentialResponse: handleCredentialResponse,
    ensureElementAccessibility: ensureElementAccessibility,
    addAriaLabel: addAriaLabel,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    newFocusTrap,
    getSvgAccessibleName,
    createInPageButton,
    setHtmlLangAttribute,
    ensureElementHasId,
    addLangAttribute,
    sanitizeFilename,
    readFileSafe,
    processData,
    filterValidItems,
    groupByCategory,
    transformInputData,
    activeTraps,
    cleanupFocusTraps
};

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
    window.accessibilityUtils = accessibilityUtils;
    window.exportUtils = exportUtils;
    window.initAccessibility = initAccessibility;
    window.handleCredentialResponse = handleCredentialResponse;
    window.ensureElementAccessibility = ensureElementAccessibility;
    window.addAriaLabel = addAriaLabel;
    window.getLangAttribute = getLangAttribute;
    window.personName = personName;
    window.validateTableAccessibility = validateTableAccessibility;
    window.validateTableStructure = validateTableStructure;
    window.validateLandmark = validateLandmark;
    window.validateLandmarkStructure = validateLandmarkStructure;
    window.newFocusTrap = accessibilityUtils.newFocusTrap;
    window.getSvgAccessibleName = getSvgAccessibleName;
    window.createInPageButton = createInPageButton;
    window.setHtmlLangAttribute = setHtmlLangAttribute;
    window.ensureElementHasId = ensureElementHasId;
    window.addLangAttribute = addLangAttribute;
    window.sanitizeFilename = sanitizeFilename;
    window.readFileSafe = readFileSafe;
    window.processData = processData;
    window.filterValidItems = filterValidItems;
    window.groupByCategory = groupByCategory;
    window.transformInputData = transformInputData;
    window.cleanupFocusTraps = cleanupFocusTraps;
}