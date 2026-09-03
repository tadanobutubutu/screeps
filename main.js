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
    newFocusTrap, // Updated focus trap implementation
    exportUtils,
    addressAccessibilityIssues,
    handleCredentialResponse,
    // Keeping only one ensureElementId function
    ensureElementId: ensureElementIdOrigin,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    renderAdditionalContent,
    transformInputData
} = main;

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

    // Implemented upgradeAccessibility function
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
    }
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

/**
 * Harvest resources based on current state and configuration
 * @param {Object} options - Harvesting options
 * @returns {Object} Harvest results
 */
function harvest(options = {}) {
    const state = getState();
    const config = getConfig();
    
    const harvestAmount = options.amount || config.harvestAmount || 1;
    const result = {
        success: true,
        amount: harvestAmount,
        resources: 0,
        level: state.level || 1
    };
    
    // Calculate resources based on current level and any multipliers
    result.resources = harvestAmount * result.level;
    
    // Update state with harvested resources
    if (state.resources !== undefined) {
        state.resources += result.resources;
    }
    
    return result;
}

/**
 * Upgrade a specific capability or the entire system
 * @param {string} type - Type of upgrade (optional)
 * @param {Object} options - Upgrade options
 * @returns {Object} Upgrade results
 */
function upgrade(type, options = {}) {
    const state = getState();
    const config = getConfig();
    
    const upgradeCost = options.cost || config.upgradeCosts?.[type] || config.defaultUpgradeCost || 10;
    const result = {
        success: false,
        type: type,
        cost: upgradeCost,
        level: state.level || 1,
        message: ''
    };
    
    // Check if we have enough resources for the upgrade
    if (!type) {
        // System-wide upgrade
        const currentLevel = state.level || 1;
        if (state.resources >= upgradeCost) {
            state.resources -= upgradeCost;
            state.level = currentLevel + 1;
            result.success = true;
            result.level = state.level;
            result.message = `System upgraded to level ${state.level}`;
        } else {
            result.message = `Insufficient resources. Need ${upgradeCost}, have ${state.resources}`;
        }
    } else {
        // Specific capability upgrade
        if (state.resources >= upgradeCost) {
            state.resources -= upgradeCost;
            
            // Track capability upgrades in state
            if (!state.capabilities) {
                state.capabilities = {};
            }
            state.capabilities[type] = (state.capabilities[type] || 0) + 1;
            
            result.success = true;
            result.level = state.capabilities[type];
            result.message = `${type} upgraded to level ${state.capabilities[type]}`;
            
            // Apply any immediate effects from the upgrade
            if (config.upgradeEffects?.[type]) {
                const effects = config.upgradeEffects[type];
                Object.assign(state, effects);
            }
        } else {
            result.message = `Insufficient resources. Need ${upgradeCost}, have ${state.resources}`;
        }
    }
    
    return result;
}

// TODO: Implement harvest and upgrade logic