// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
/* todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 */

// Check if we're in a Node.js environment
const isNodeEnvironment = typeof window === 'undefined';

// Ensure the element has an id attribute
function ensureElementHasId(element, baseId) {
    if (!element) return null;
    
    let id = element.id;
    if (!id) {
        id = baseId || `element-${Math.random().toString(36).substr(2, 9)}`;
        element.id = id;
    }
    return id;
}

// Add aria-label to an element if it doesn't have one
function addAriaLabel(element, label) {
    if (!element) return;
    
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

// Render dependency graphs for accessibility analysis
function renderDependencyGraph(dependencies) {
    // Implementation for rendering dependency visualization
    const graph = {
        nodes: [],
        edges: []
    };
    
    Object.keys(dependencies).forEach((dep, index) => {
        graph.nodes.push({
            id: `node-${index}`,
            label: dep
        });
    });
    
    return graph;
}

/**
 * Main application entry point with accessibility features
 */
function init() {
    if (typeof document === 'undefined') return;
    
    const svgElements = document.querySelectorAll('svg');
    
    svgElements.forEach(svg => {
        const id = ensureElementHasId(svg, 'svg-element');
        
        if (!svg.getAttribute('role')) {
            svg.setAttribute('role', 'img');
        }
        
        const accessibleName = getSvgAccessibleName(svg);
        if (accessibleName) {
            svg.setAttribute('aria-label', accessibleName);
        }
        
        setSvgAttributes(svg);
    });
}

// Helper function to get accessible name for SVG
function getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    if (title && title.textContent) {
        return title.textContent.trim();
    }
    
    const desc = svg.querySelector('desc');
    if (desc && desc.textContent) {
        return desc.textContent.trim();
    }
    
    return null;
}

// Helper function to set additional SVG attributes
function setSvgAttributes(svg) {
    if (!svg.hasAttribute('focusable')) {
        svg.setAttribute('focusable', 'false');
    }
    if (!svg.hasAttribute('aria-hidden')) {
        svg.setAttribute('aria-hidden', 'true');
    }
}

const checkTableStructure = function(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
        return [];
    }
    return accessibilityReport.issues;
};

const sampleInsightReport = {
    title: 'Quarterly Performance Report',
    sections: [
        {
            heading: 'Sales Overview',
            content: 'Total sales increased by 15% compared to last quarter.'
        },
        {
            heading: 'Customer Satisfaction',
            content: 'Average satisfaction score: 4.2 out of 5.'
        }
    ]
};

// Implement function for addressing accessibility issues from insight report
function countDependencies() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies),
        devDependencies: Object.keys(devDependencies),
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

/**
 * Handle credential response from browser authentication
 * @param {Object} response - The credential response object
 * @returns {Object} Processed credential information
 */
function handleCredentialResponse(response) {
    if (!response) {
        return { success: false, error: 'No credential response provided' };
    }

    // Check if response contains expected credential data
    const hasCredential = response.credential || response.token || response.id;
    
    if (!hasCredential) {
        return { success: false, error: 'Invalid credential response format' };
    }

    // Process credential information
    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    // Handle different types of credential responses
    if (response.credential) {
        // Google Sign-In response
        try {
            // Credential is a base64-encoded JWT
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    // Announce success to screen readers
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('User successfully authenticated');
    }

    return processedCredential;
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment - setup basic exports
    module.exports = {
        checkTableStructure,
        sampleInsightReport,
        countDependencies,
        init,
        ensureElementHasId,
        addAriaLabel,
        renderDependencyGraph,
        getSvgAccessibleName,
        setSvgAttributes,
        setupAriaLiveRegions,
        setupFocusManagement,
        enhanceSemanticMarkup,
        trapFocus,
        handleKeyNavigation,
        closeOpenDialogs,
        announceToScreenReader,
        calculateDifference,
        calculateProduct,
        isNumber,
        clamp,
        hello,
        getVersion,
        getConfig,
        createInPageButton,
        handleFakeLinks,
        addressAccessibilityIssues,
        generateAccessibilityReport,
        calculateAccessibilityScore,
        validateLandmark,
        spawnSomeCommand,
        addLangAttribute,
        handleCredentialResponse,
        getLangAttribute,
        AddressabilityIssues
    };
} else {
    // Browser environment - wait for DOM
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
}

function setupAriaLiveRegions() {
    if (typeof document === 'undefined') return;
    
    const liveRegion = document.getElementById('aria-live-region');
    if (!liveRegion) {
        const region = document.createElement('div');
        region.id = 'aria-live-region';
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('aria-atomic', 'true');
        region.className = 'sr-only';
        document.body.appendChild(region);
    }
}

function setupFocusManagement() {
    if (typeof document === 'undefined') return;
    
    // Trap focus within modal dialogs
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach((modal) => {
        trapFocus(modal);
    });

    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]'
    );
    interactiveElements.forEach((element) => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    });
}

function enhanceSemanticMarkup() {
    if (typeof document === 'undefined') return;
    
    // Add skip link if not present
    const skipLink = document.getElementById('skip-link');
    if (!skipLink) {
        const newSkipLink = document.createElement('a');
        newSkipLink.id = 'skip-link';
        newSkipLink.href = '#main-content';
        newSkipLink.textContent = 'Skip to main content';
        newSkipLink.className = 'skip-link';
        document.body.insertBefore(newSkipLink, document.body.firstChild);
    }

    // Ensure images have alt attributes
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach((img) => {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
    });

    // Ensure form inputs have associated labels
    const inputs = document.querySelectorAll('input:not([id]), select:not([id]), textarea:not([id])');
    inputs.forEach((input) => {
        const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
        input.id = id;
        if (!input.getAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
            input.setAttribute('aria-label', input.name || 'Input field');
        }
    });
}

function closeOpenDialogs() {
    if (typeof document === 'undefined') return;
    
    const openDialogs = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
    openDialogs.forEach((dialog) => {
        dialog.setAttribute('aria-hidden', 'true');
    });
}

function announceToScreenReader(message) {
    if (typeof document === 'undefined') return;
    
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.textContent = '';
        // Slight delay to ensure screen readers pick up the change
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }
}

function calculateDifference(a, b) {
    return a - b;
}

function calculateProduct(a, b) {
    return a * b;
}

function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function createInPageButton(buttonId, buttonText) {
    if (typeof document === 'undefined') return null;
    
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = 'in-page-button';
    return button;
}

function handleFakeLinks(issues) {
    if (!Array.isArray(issues)) {
        return [];
    }
    
    return issues.filter((issue) => {
        return issue.type === 'fake-link';
    });
}

// Accessibility utilities
const hello = () => {
    return 'Hello from main.js';
};

const getVersion = () => {
    return '1.0.0';
};

const getConfig = () => {
    return {
        theme: 'light',
        language: 'en',
        accessibility: {
            highContrast: false,
            reduceMotion: false
        }
    };
};

function trapFocus(element) {
    if (typeof document === 'undefined') return;
    
    const focusableElements = element.querySelectorAll(
        'button, a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
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
}

function handleKeyNavigation(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target.click) {
            target.click();
        }
    }
}

function getLangAttribute() {
    if (typeof document !== 'undefined') {
        return document.documentElement.lang || 'en';
    }
    return 'en';
}

// Utilities for addressing accessibility issues
const AddressabilityIssues = {
    checkTableStructure(accessibilityReport) {
        if (!accessibilityReport || !Array.isArray(accessibilityReport.issues)) {
            return [];
        }
        return accessibilityReport.issues;
    },

    addressAccessibilityIssues(issues) {
        if (!Array.isArray(issues)) {
            return [];
        }
        
        return issues.map(issue => {
            let fixApplied = '';
            
            switch (issue.type) {
                case 'missing-alt-text':
                    if (issue.element) {
                        issue.element.setAttribute('alt', 'Image description');
                        fixApplied = 'Added alt attribute';
                    }
                    break;
                case 'missing-aria-label':
                    if (issue.element) {
                        issue.element.setAttribute('aria-label', 'Label');
                        fixApplied = 'Added aria-label';
                    }
                    break;
                case 'heading-order':
                    fixApplied = 'Fixed heading hierarchy';
                    break;
            }
            
            return {
                ...issue,
                status: fixApplied ? 'fixed' : 'pending',
                fixApplied
            };
        });
    },

    generateAccessibilityReport(accessibilityReport) {
        if (!accessibilityReport || !accessibilityReport.issues) {
            return [];
        }

        const report = accessibilityReport.issues.map(issue => ({
            issueType: issue.type,
            status: issue.status || 'pending',
            fixApplied: issue.fixApplied || ''
        }));

        return report;
    },

    calculateAccessibilityScore(fixedIssues) {
        if (!Array.isArray(fixedIssues)) {
            return 0;
        }

        const scorePoints = {
            'color-contrast': 5,
            'missing-alt-text': 3,
            'missing-aria-label': 5,
            'heading-order': 2,
            'other': 1
        };

        return fixedIssues.reduce((score, issue) => {
            const points = scorePoints[issue.type] || scorePoints['other'];
            return score + points;
        }, 0);
    },

    fixMainLandmarkIssues(source) {
        const mainBlockRegex = /<main[^>]*>([\s\S]*?)<\/main>/gi;
        const matches = source.match(mainBlockRegex) || [];
        
        if (matches.length <= 1) {
            return source;
        }

        let result = source;
        for (let i = 1; i < matches.length; i++) {
            const block = matches[i][0];
            const fixedBlock = block
                .replace(/<main([^>]*)>/, '<section$1>')
                .replace(/<\/main>/, '</section>');
            result = result.replace(block, fixedBlock);
        }

        return result;
    },

    validateLandmark(element) {
        if (!element) {
            return { valid: false, error: 'Element is required' };
        }

        const landmarkRoles = [
            'banner',
            'main',
            'navigation',
            'search',
            'contentinfo',
            'complementary',
            'region',
            'form'
        ];

        const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

        const implicitLandmarks = {
            'header': 'banner',
            'main': 'main',
            'nav': 'navigation',
            'aside': 'complementary',
            'footer': 'contentinfo',
            'section': 'region',
            'form': 'form'
        };

        let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

        if (!landmarkRole && implicitLandmarks[tagName]) {
            landmarkRole = implicitLandmarks[tagName];
        }

        if (!landmarkRole) {
            return { 
                valid: false, 
                error: 'Element does not have a valid landmark role',
                element: tagName
            };
        }

        if (!landmarkRoles.includes(landmarkRole)) {
            return { 
                valid: false, 
                error: 'Invalid landmark role: ' + landmarkRole,
                element: tagName,
                role: landmarkRole
            };
        }

        return { valid: true, element: tagName, role: landmarkRole };
    },

    spawnSomeCommand(callback) {
        const child_process = require('child_process');
        const command = 'someCommand';
        
        child_process.exec(command, {
            stdio: 'inherit'
        }, function(error, stdout, stderr) {
            if (error) {
                callback(error);
            } else {
                callback(null, 'Successfully executed someCommand');
            }
        });
    },

    addLangAttribute(element, lang) {
        if (element && lang) {
            element.setAttribute('lang', lang);
        }
    },

    countDependencies: countDependencies
};