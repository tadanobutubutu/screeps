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
  announceToScreenReader: originalAnnounceToScreenReader,
  handleKeyboardNav,
  exportUtils,
  transformInputData,
  addressAccessibilityIssues,
  handleCredentialResponse,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  initSkipLink,
  trapFocus,
  newFocusTrap
} = main;

// Accessibility utilities for keyboard navigation and screen reader support
const accessibilityUtils = {
    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announceToScreenReader: function (message, priority = 'polite') {
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
    },

    handleKeyboardNav: function (e, handlers) {
        const key = e.key;
        if (handlers[key]) {
            handlers[key](e);
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

    /**
     * Ensure an element has an ID, throwing if element is missing
     * @param {HTMLElement} element - The element to ensure has an ID
     * @param {string} prefix - Prefix for generated IDs
     * @returns {HTMLElement} The element with an ID
     */
    ensureElementHasId: function (element, prefix = 'element') {
        if (!element) {
            throw new Error('Element is required');
        }
        if (!element.id) {
            element.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        return element;
    },

    wrapPrimaryContentInMain: function () {
        let mainElement = document.querySelector('main');

        if (!mainElement) {
            mainElement = document.createElement('main');

            const contentSelectors = ['#content', '.content', '#main', '.main', 'article', '[role="main"]'];
            let primaryContent = null;

            for (const selector of contentSelectors) {
                primaryContent = document.querySelector(selector);
                if (primaryContent) {
                    break;
                }
            }

            if (!primaryContent) {
                primaryContent = document.body;
            }

            if (primaryContent !== document.body) {
                mainElement.appendChild(primaryContent);
                document.body.insertBefore(mainElement, document.body.firstChild);
            } else {
                const children = Array.from(document.body.children);
                children.forEach(child => {
                    if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && child.tagName !== 'LINK') {
                        mainElement.appendChild(child);
                    }
                });
                document.body.insertBefore(mainElement, document.body.firstChild);
            }

            mainElement.setAttribute('role', 'main');

            if (!mainElement.getAttribute('aria-label') && !mainElement.getAttribute('aria-labelledby')) {
                mainElement.setAttribute('aria-label', 'Main content');
            }
        }

        return mainElement;
    }
};

function generateAccessibilityReport(container) {
    const report = {
        issues: [],
        summary: { critical: 0, serious: 0, moderate: 0, minor: 0 }
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

function updateAccessibilityConfig(newConfig) {
    setConfig(newConfig);
}

// TODO: Implement the new function as per the issue requirements
function newFunction() {
    // Implementation of the new function
}

module.exports = {
  ...accessibilityUtils,
  renderDependencyGraph: main.renderDependencyGraph || (() => {}),
  renderIndex: main.renderIndex || (() => {}),
  validateTableAccessibility,
  validateTableStructure,
  getConfig,
  setConfig,
  wrapPrimaryContentInMain: accessibilityUtils.wrapPrimaryContentInMain,
  updateAccessibilityConfig,
  generateAccessibilityReport,
  focusTrap,
  handleCredentialResponse: main.handleCredentialResponse,
  initAccessibility: main.initAccessibility,
  groupByCategory: main.groupByCategory,
  log: main.log,
  sanitizeFilename: main.sanitizeFilename,
  readFileSafe: main.readFileSafe,
  processData: main.processData,
  filterValidItems: main.filterValidItems,
  exportUtilities: main.exportUtilities,
  newFunction
};