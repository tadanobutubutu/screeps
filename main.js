// main.js
// ... existing code above line 255 ...

const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
const { functionA, functionB } = require('./functionModule');
const {
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    ensureUniqueLandmarks,
    setSvgAccessibilityProps,
    addSvgAccessibleNames,
    addAccessibleNamesToSVGs,
    fixFakeLinkIssue,
    fixFakeLinkIssues,
    fixLandmarkIssues,
    addLandmarkRegions,
    uniqueLandmarks,
    fixImageAltTexts,
    googleSignIn,
} = require('./utilities');

const http = require('http');
const url = require('url');

// Function to validate table accessibility
const validateTableAccessibility = (html) => {
    const issues = [];

    // Check if HTML contains tables
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let match;

    while ((match = tableRegex.exec(html)) !== null) {
        const tableContent = match[0];
        const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;

        // Check for caption
        const hasCaption = /<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableContent);
        if (!hasCaption) {
            issues.push({
                type: 'table',
                severity: 'warning',
                message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
                suggestion:
                    'Add a <caption> element immediately after the <table> tag to describe the purpose of the table',
            });
        }

        // Check for th elements
        const hasHeaders = /<th[^>]*>/i.test(tableContent);
        if (!hasHeaders) {
            issues.push({
                type: 'table',
                severity: 'warning',
                message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
                suggestion:
                    'Add <th> elements for column or row headers to improve accessibility for screen readers',
            });
        }

        // Check for scope attributes on th elements
        const thMatches = tableContent.match(/<th[^>]*>/gi) || [];
        thMatches.forEach((thTag, index) => {
            if (!/scope=["'](row|col|rowgroup|colgroup)["']/i.test(thTag)) {
                issues.push({
                    type: 'table',
                    severity: 'info',
                    message: `Table ${tableNumber} header ${index + 1} is missing a 'scope' attribute`,
                    suggestion:
                        'Add scope="col", scope="row", scope="rowgroup", or scope="colgroup" to <th> elements',
                });
            }
        });

        // Check for thead and tbody structure
        const hasThead = /<thead[^>]*>[\s\S]*?<\/thead>/i.test(tableContent);
        const hasTbody = /<tbody[^>]*>[\s\S]*?<\/tbody>/i.test(tableContent);

        if (!hasThead) {
            issues.push({
                type: 'table',
                severity: 'info',
                message: `Table ${tableNumber} is missing <thead> element`,
                suggestion: 'Wrap header rows in a <thead> element for better semantic structure',
            });
        }

        if (!hasTbody) {
            issues.push({
                type: 'table',
                severity: 'info',
                message: `Table ${tableNumber} is missing <tbody> element`,
                suggestion: 'Wrap data rows in a <tbody> element for better semantic structure',
            });
        }

        // Check for id and headers attributes for complex tables
        const hasMultipleHeaders = (tableContent.match(/<th/gi) || []).length > 1;
        if (hasMultipleHeaders) {
            const hasHeadersAttr = /headers=["'][^"']+["']/.test(tableContent);
            const hasIdAttr = /id=["'][^"']+["']/.test(tableContent.replace(/<th/gi, '<td'));

            if (!hasIdAttr && !hasHeadersAttr) {
                issues.push({
                    type: 'table',
                    severity: 'warning',
                    message: `Table ${tableNumber} has multiple headers but may not have proper id/headers associations`,
                    suggestion:
                        'For complex tables, ensure header cells have unique id attributes and data cells have headers attributes referencing those ids',
                });
            }
        }
    }

    return issues;
};

function validateTableStructure(tableElement) {
    if (typeof document === 'undefined' || !tableElement) {
        return { valid: false, errors: ['Table element not found'] };
    }

    const errors = [];
    const rows = tableElement.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        const cellCount = cells.length;

        // Check for empty cells
        cells.forEach((cell, cellIndex) => {
            if (!cell.textContent.trim()) {
                errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
            }
        });

        // Check that rows have consistent cell counts
        if (rowIndex > 0) {
            const prevRow = rows[rowIndex - 1];
            const prevCells = prevRow.querySelectorAll('td');
            if (cellCount !== prevCells.length) {
                errors.push(
                    `Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`
                );
            }
        }
    });

    return errors;
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
    if (typeof document === 'undefined' || !element) {
        return { valid: false, errors: ['Element not found'] };
    }

    const errors = [];
    const validLandmarks = [
        'header',
        'nav',
        'main',
        'aside',
        'footer',
        'section',
        'article',
        'search',
    ];

    // Check if element is a valid landmark
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();

    if (role && !validLandmarks.includes(role)) {
        errors.push(`Element has invalid landmark role: ${role}`);
    }

    if (!role && !validLandmarks.includes(tagName)) {
        errors.push(`Element is not a valid landmark: ${tagName}`);
    }

    // Check for accessible name
    const hasLabel =
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        element.querySelector('h1, h2, h3, h4, h5, h6');

    if (!hasLabel) {
        errors.push(
            'Landmark is missing accessible name (aria-label, aria-labelledby, or heading)'
        );
    }

    return { valid: errors.length === 0, errors };
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
    const fixes = {
        langAdded: false,
        mainLandmarkAdded: false,
        landmarksFixed: 0,
        svgNamesAdded: 0,
        fakeLinksFixed: 0,
    };

    if (!report || !report.issues) {
        return fixes;
    }

    // Combine languages
    const existingLangAttribute = container.querySelector('html')?.getAttribute('lang');
    const newLangAttribute = report.issues.missingLang?.[0]?.lang || 'en';
    if (existingLangAttribute !== newLangAttribute) {
        container.querySelector('html')?.setAttribute('lang', newLangAttribute);
        fixes.langAdded = true;
    }

    // Add main landmark if missing
    if (!container.querySelector('main')) {
        const firstSection = container.querySelector('section');
        if (firstSection) {
            const mainElement = container.ownerDocument.createElement('main');
            while (firstSection.firstChild) {
                mainElement.appendChild(firstSection.firstChild);
            }
            firstSection.parentNode.insertBefore(mainElement, firstSection);
            firstSection.remove();
            fixes.mainLandmarkAdded = true;
        }
    }

    // Fix landmarks by ensuring proper roles and accessible names
    if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
        report.issues.landmarkIssues.forEach((issue) => {
            const element = container.querySelector(issue.selector);
            if (element) {
                // Add accessible name if missing
                if (
                    !element.getAttribute('aria-label') &&
                    !element.getAttribute('aria-labelledby')
                ) {
                    // Try to get label from surrounding context
                    const previousSibling = element.previousElementSibling;
                    if (previousSibling && previousSibling.textContent.trim()) {
                        const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        const labelSpan = container.ownerDocument.createElement('span');
                        labelSpan.id = labelId;
                        labelSpan.textContent = previousSibling.textContent.trim();
                        labelSpan.style.display = 'none';
                        element.parentNode.insertBefore(labelSpan, element);
                        element.setAttribute('aria-labelledby', labelId);
                    } else {
                        // Use role as fallback label
                        const role = element.getAttribute('role') || element.tagName.toLowerCase();
                        element.setAttribute('aria-label', role);
                    }
                    fixes.landmarksFixed++;
                }
            }
        });
    }

    // Fix SVG accessible names
    if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
        report.issues.svgIssues.forEach((issue) => {
            const svg = container.querySelector(issue.selector);
            if (svg && svg.tagName.toLowerCase() === 'svg') {
                svg.setAttribute('aria-label', issue.suggestedName || 'Decorative SVG');
                fixes.svgNamesAdded++;
            }
        });
    }

    // Fix fake links (elements that look like links but aren't)
    if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
        report.issues.fakeLinkIssues.forEach((issue) => {
            const element = container.querySelector(issue.selector);
            if (element) {
                // Check if this element should be a link or a button
                const isNavigation = element.closest('nav') !== null;

                if (isNavigation || element.tagName.toLowerCase() === 'a') {
                    // Convert to proper link with href
                    if (!element.hasAttribute('href')) {
                        element.setAttribute(
                            'href',
                            '#' +
                                (element.id ||
                                    `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
                        );
                        element.setAttribute('role', 'link');
                        fixes.fakeLinksFixed++;
                    }
                } else {
                    // Convert to button
                    element.setAttribute('role', 'button');
                    if (!element.hasAttribute('tabindex')) {
                        element.setAttribute('tabindex', '0');
                    }
                    fixes.fakeLinksFixed++;
                }
            }
        });
    }

    return fixes;
}

// App state for session management
const appState = {
    sessions: new Map(),
};

// Helper functions for session management
function getActiveSessionsCount() {
    return appState.sessions.size;
}

function validateSession(sessionId) {
    return appState.sessions.get(sessionId) || null;
}

function handleCredentialResponse(credentialResponse) {
    // Process credential response - basic implementation
    if (!credentialResponse || typeof credentialResponse !== 'object') {
        return { status: 'error', message: 'Invalid credential response' };
    }
    return { status: 'success', credential: credentialResponse };
}

const a11yStore = {
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    prefersHighContrast() {
        return window.matchMedia('(prefers-contrast: more)').matches;
    },

    focusTrap: focusTrap,

    updateLiveRegion(message, priority = 'polite') {
        if (!this.liveRegion) this.createLiveRegion();
        this.announce(message, priority);
    },

    checkLandmarkElements() {
        const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
        landmarkElements.forEach((element, index) => {
            const landmarks = document.querySelectorAll(`[role="${element}"]`);
            landmarks.forEach((landmark) => {
                if (landmark.id === '') {
                    landmark.setAttribute('id', `${element}-${index}`);
                }
            });
        });
    },
};

const renderIndex = (data, options = {}) => {
    // Use the imported indexContent module for rendering
    const content = indexContent(data, options);
    // Use the imported addLangAttribute module for ensuring lang attribute
    if (content && typeof content === 'string') {
        return addLangAttribute(content);
    }
    return content;
};

function getSvgAccessibleName(svgElement) {
    const title = svgElement.querySelector('title');
    const desc = svgElement.querySelector('desc');

    if (title && title.textContent) {
        return title.textContent.trim();
    }

    if (desc && desc.textContent) {
        return desc.textContent.trim();
    }

    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel.trim();
    }

    const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labeledElement = document.getElementById(ariaLabelledby);
        if (labeledElement && labeledElement.textContent) {
            return labeledElement.textContent.trim();
        }
    }

    return 'SVG graphic';
}

const renderDependencyGraph = (deps, options = {}) => {
    // Use the imported dependencyGraphContent module for rendering
    const graphData = dependencyGraphContent(deps, options);
    renderGraphIndex(graphData);
};

// TODO: Implement the new function as per the issue requirements
function newFunction(param1, param2) {
    // Implementation goes here
    // This should be the only change made to the file
    // All existing code and exports must remain unchanged
    return param1 + param2; // Example implementation
}

const ensureElementId = (element) => {
    if (element && !element.id) {
        element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element;
};

/**
 * Get all loaded tables
 * @returns {Array} Array of table objects
 */
function getTables() {
    return appData.tables;
}

/**
 * Get application configuration
 * @returns {Object} Configuration object
 */
function getConfig() {
    return { ...appData.config };
}

/**
 * Set application configuration
 * @param {Object} config - Configuration object
 */
function setConfig(config) {
    appData.config = { ...appData.config, ...config };
}

/**
 * Validates that all tables in the application meet accessibility standards
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility() {
    // ... existing code ...
}

const addAriaLabel = (element, label) => {
    if (element) {
        element.setAttribute('aria-label', label);
    }
    return element;
};

const renderDependencyGraph = (data) => {
    // Implementation for rendering dependency graphs
    return {
        nodes: data.nodes || [],
        edges: data.edges || [],
    };
};

function ensureElementHasId(element, prefix = 'element') {
    // ... existing code ...
}

function renderDependencyGraphs(container, dependencies, options = {}) {
    // ... existing code ...
}

function focusTrap(element) {
    // ... existing code ...
}

function newFocusTrap() {
    // New function implementation
}

function spawnProcess(command, args = [], options = {}) {
    return spawn(command, args, options);
}

// Credential response handling
async function handleCredentialResponse(response) {
    // ... existing code ...
}

// Export functionality with accessibility support
const exportUtils = {
    // ... existing code ...
};

function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

function readFileSafe(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        log(`Error reading file ${filePath}: ${error.message}`, 'error');
        return null;
    }
}

// Existing utility functions
function log(message, level = 'info') {
    // ... existing code ...
}

// Make sure to preserve all existing exports
module.exports = {
    // existing exports...
    newFunction, // Add the new function to exports
    newFocusTrap, // Add the new function to exports
};
