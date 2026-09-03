const fs = require('fs');
const main = require('./utilities');

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
    ensureElementHasId: ensureElementIdOrigin,
    ensureElementId,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    renderAdditionalContent,
    transformInputData
} = main;

const accessibilityUtils = {
    initSkipLink: function () {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        }
    },
    trapFocus: function (element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    },
    announceToScreenReader: function (message, priority) {
        if (priority === undefined) {
            priority = 'polite';
        }
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        setTimeout(function () {
            announcer.remove();
        }, 1000);
    },
    handleKeyboardNav: function (e, handlers) {
        const key = e.key;
        if (handlers[key]) {
            handlers[key](e);
        }
    },
    newFocusTrap: function (element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

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
    }
};

function renderDependencyGraph(data) {
    // Implementation for rendering dependency graphs
    return {
        nodes: data.nodes || [],
        edges: data.edges || []
    };
}

function generateAccessibilityReport(issues) {
    const report = {
        timestamp: new Date().toISOString(),
        totalIssues: issues.length,
        critical: issues.filter(i => i.impact === 'critical').length,
        serious: issues.filter(i => i.impact === 'serious').length,
        moderate: issues.filter(i => i.impact === 'moderate').length,
        minor: issues.filter(i => i.impact === 'minor').length,
        issues: issues.map(issue => ({
            id: issue.id,
            impact: issue.impact,
            description: issue.description,
            help: issue.help,
            helpUrl: issue.helpUrl,
            nodes: issue.nodes.map(node => ({
                html: node.html,
                target: node.target
            }))
        }))
    };

    if (typeof validateAccessibilityReport === 'function') {
        validateAccessibilityReport(report);
    }

    return report;
}

function getTables() {
    return appData.tables;
}

function getConfig() {
    return { ...appData.config };
}

function setConfig(config) {
    appData.config = { ...appData.config, ...config };
}

// Validate table structure for accessibility issues
// Uses the imported validateTableStructure function from utilities
function validateTableStructureForAccessibility(table) {
    const issues = [];
    
    if (!table) {
        return issues;
    }

    // Check if table has proper structure
    const hasCaption = table.querySelector('caption');
    const hasHeaderCells = table.querySelector('th');
    const hasDataCells = table.querySelector('td');
    
    // Report missing caption for complex tables
    if (!hasCaption && table.rows && table.rows.length > 3) {
        issues.push({
            id: 'table-missing-caption',
            impact: 'moderate',
            description: 'Complex table should have a caption describing its contents',
            help: 'Add a <caption> element to describe the table purpose',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
        });
    }

    // Check for proper th usage
    if (hasDataCells && !hasHeaderCells) {
        issues.push({
            id: 'table-missing-headers',
            impact: 'serious',
            description: 'Data table should have header cells marked with <th>',
            help: 'Use <th> elements for column or row headers',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html'
        });
    }

    // Check for scope attribute on headers
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        if (!header.hasAttribute('scope') && !header.hasAttribute('aria-columncount')) {
            // Only warn if there are multiple header cells that might need scope
            if (headers.length > 1) {
                issues.push({
                    id: 'table-header-missing-scope',
                    impact: 'minor',
                    description: `Header cell "${header.textContent.substring(0, 20)}" should have a scope attribute`,
                    help: 'Add scope="col" or scope="row" to header cells',
                    helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/headers-and-footers.html'
                });
            }
        }
    });

    // Call the imported validateTableStructure if available
    if (typeof validateTableStructure === 'function') {
        const additionalIssues = validateTableStructure(table);
        if (Array.isArray(additionalIssues)) {
            issues.push(...additionalIssues);
        }
    }

    return issues;
}

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.querySelector('.dependency-graph');

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

// Export functions for use in other modules
module.exports = {
  initSkipLink: accessibilityUtils.initSkipLink,
  trapFocus: accessibilityUtils.trapFocus,
  newFocusTrap: accessibilityUtils.newFocusTrap,
  announceToScreenReader: accessibilityUtils.announceToScreenReader,
  handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementId: accessibilityUtils.ensureElementId,
  renderDependencyGraphs,
  validateTableStructure,
  validateTableStructureForAccessibility,
  accessibilityUtils,
  getConfig,
  setConfig
};