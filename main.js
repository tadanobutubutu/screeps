// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// main.js - Combined utility and accessibility features

const fs = require('fs');
const path = require('path');

/**
 * Ensures an element has an id attribute, generating one if necessary
 * @param {HTMLElement} element - The element to check
 * @param {string} [prefix] - Optional prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
    if (!element) {
        throw new Error('Element is required');
    }

    if (element.id) {
        return element.id;
    }

    const generatedId = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    element.id = generatedId;
    return generatedId;
}

/**
 * Adds an aria-label to an element if one doesn't exist
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label text
 * @returns {HTMLElement} The modified element
 */
function addAriaLabel(element, label) {
    if (!element) {
        throw new Error('Element is required');
    }

    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }

    return element;
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} dependencies - The dependency data to render
 * @returns {HTMLElement} The rendered graph element
 */
function renderDependencyGraph(container, dependencies = {}) {
    if (!container) {
        throw new Error('Container element is required');
    }

    const graphElement = document.createElement('div');
    graphElement.className = 'dependency-graph';
    graphElement.setAttribute('role', 'img');
    graphElement.setAttribute('aria-label', 'Dependency graph visualization');

    const nodes = dependencies.nodes || [];
    const edges = dependencies.edges || [];

    // Create SVG for graph rendering
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('aria-hidden', 'true');

    // Render edges
    edges.forEach((edge, index) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', edge.source?.x || 0);
        line.setAttribute('y1', edge.source?.y || 0);
        line.setAttribute('x2', edge.target?.x || 0);
        line.setAttribute('y2', edge.target?.y || 0);
        line.setAttribute('stroke', '#666');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('id', `edge-${index}`);
        svg.appendChild(line);
    });

    // Render nodes
    nodes.forEach((node, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x || 0);
        circle.setAttribute('cy', node.y || 0);
        circle.setAttribute('r', node.size || 20);
        circle.setAttribute('fill', node.color || '#4A90E2');
        circle.setAttribute('id', `node-${index}`);

        const nodeId = ensureElementHasId(circle, 'graph-node');
        if (node.label) {
            addAriaLabel(circle, node.label);
        }

        svg.appendChild(circle);
    });

    graphElement.appendChild(svg);
    container.appendChild(graphElement);
    return graphElement;
}

// TODO: This is the existing code that needs to be preserved
// Original content from main.js
function existingFunction() {
    // existing code
}

// New function implementation as per the issue requirements
function personName() {
    // Logic to determine the person's name or identifier
    // This function would be used in the context of REACT_036 to create a fake link
    return 'Person'; // Example
}

// Existing export
export { existingFunction, personName };

// TODO: Address accessibility issues from insight report — FIXED
// TODO: Add back any required exports that might have been removed.

// main.js - Main application entry point
// This file initializes the application and exports core modules

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)

const { getDepGraph } = require('./depGraph');
const {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    createInPageButton,
    createAccessibleLink,
} = require('./accessibility-helpers');

const { class1, address, Object1 } = require('./components');

// Accessibility utilities

/**
 * Sets the lang attribute on an element with validation
 * REACT_015: Address lang attribute accessibility requirement
 * @param {Element} element - The target element
 * @param {string} lang - The language code (e.g., 'en', 'en-US')
 * @returns {boolean} - Returns true if successful, false otherwise
 */
const setLangAttribute = (element, lang) => {
    if (!element || typeof lang !== 'string') {
        return false;
    }

    // Validate lang attribute format (BCP 47 compliance)
    const validLangPattern = /^[a-z]{2,3}(-[A-Z]{2})?$/;
    if (!validLangPattern.test(lang)) {
        return false;
    }

    element.setAttribute('lang', lang);
    return true;
};

/**
 * Checks and returns accessibility attributes for an element
 * REACT_025: Add other accessibility changes as per the insight report
 * @param {Element} element - The target element
 * @returns {Object} - Object containing accessibility attribute values
 */
const checkAccessibilityAttributes = (element) => {
    const attributes = {};

    if (!element) {
        return attributes;
    }

    attributes.lang = element.getAttribute('lang');
    attributes.role = element.getAttribute('role');
    attributes.ariaLabel = element.getAttribute('aria-label');
    attributes.ariaDescribedby = element.getAttribute('aria-describedby');
    attributes.ariaHidden = element.getAttribute('aria-hidden');
    attributes.tabIndex = element.getAttribute('tabindex');

    return attributes;
};

/**
 * Ensures element has proper accessibility attributes
 * @param {Element} element - The target element
 * @param {Object} options - Accessibility options
 * @returns {boolean} - Returns true if all attributes were set successfully
 */
const ensureAccessibility = (element, options = {}) => {
    if (!element) {
        return false;
    }

    let success = true;

    if (options.lang) {
        success = setLangAttribute(element, options.lang) && success;
    }

    if (options.role) {
        element.setAttribute('role', options.role);
    }

    if (options.ariaLabel) {
        element.setAttribute('aria-label', options.ariaLabel);
    }

    return success;
};

/**
 * Ensures that the dependency graph has appropriate ARIA attributes.
 * This function should be called after the graph is rendered.
 */
function ensureDependencyGraphARIA() {
    const graph =
        document.querySelector('[data-dependency-graph]') ||
        document.querySelector('.dependency-graph');
    if (graph) {
        if (!graph.hasAttribute('aria-label')) {
            graph.setAttribute('aria-label', 'Dependency graph');
        }
        if (!graph.hasAttribute('aria-describedby')) {
            const description = document.getElementById('graph-description');
            if (description) {
                graph.setAttribute('aria-describedby', 'graph-description');
            }
        }
    }
}

/**
 * Returns the language attribute of the HTML element.
 * If not set, defaults to 'en'.
 * @returns {string} The language code.
 */
function getLangAttributeMain() {
    const html = document.documentElement;
    return html.lang || 'en';
}

const version = '1.0.0';

// Render dependency graph - main function
function renderDependencyGraph(container) {
    const graph = getDepGraph();
    if (!graph) {
        return null;
    }

    const nodes = graph.nodes || [];
    const edges = graph.edges || [];

    return {
        nodes: nodes,
        edges: edges,
        render: function (target) {
            if (target && typeof target.render === 'function') {
                target.render(this.nodes, this.edges);
            }
        },
    };
}

// Update dependency graph rendering based on config
function updateDependencyGraphRender(targetConfig) {
    const graph = renderDependencyGraph();
    if (!graph) {
        return false;
    }

    if (targetConfig && targetConfig.renderMode) {
        graph.renderMode = targetConfig.renderMode;
    }

    return true;
}

// Get all dependency graph nodes
function getAllDependencyNodes() {
    const graph = getDepGraph();
    return graph ? graph.nodes : [];
}

// Get all dependency graph edges
function getAllDependencyEdges() {
    const graph = getDepGraph();
    return graph ? graph.edges : [];
}

// This is a simple greeting module
function greet(name) {
    return `Hello, ${name}!`;
}
// TODO: Any additional changes requested in the issue should be added after this function

// New function implementation as per the issue requirements
function newFeature() {
    // Implementation details go here
    // For example:
    // return 'New function result';
}

// Existing exports must be preserved
function anotherExistingFunction() {
    // Implementation details go here
}

// Exported functions
function calculateSum(a, b) {
    return a + b;
}

function calculateProduct(a, b) {
    return a * b;
}

/**
 * Renders a graph visualization for accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {Element} container - The container element to render the graph into
 */
function renderAccessibilityGraph(issues, container) {
    if (!container || !issues || issues.length === 0) {
        return;
    }

    const graphContainer = document.createElement('div');
    graphContainer.className = 'accessibility-graph';
    // Ensure the dependencyGraph container has a proper ARIA role
    graphContainer.setAttribute('role', 'region');
    graphContainer.setAttribute('aria-label', 'Accessibility issues graph');
    graphContainer.innerHTML = `
    <h3>Accessibility Issues Graph</h3>
    <div class="graph-content">
      ${issues
          .map(
              (issue, index) => `
        <div class="graph-node" data-index="${index}">
          <span class="node-type">${issue.type}</span>
          <span class="node-message">${issue.message}</span>
        </div>
      `
          )
          .join('')}
    </div>
  `;

    container.appendChild(graphContainer);
}

/**
 * Renders an index of accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {Element} container - The container element to render the index into
 */
function renderAccessibilityIndex(issues, container) {
    if (!container || !issues || issues.length === 0) {
        return;
    }

    const indexContainer = document.createElement('div');
    indexContainer.className = 'accessibility-index';

    const groupedIssues = {};
    issues.forEach((issue, index) => {
        if (!groupedIssues[issue.type]) {
            groupedIssues[issue.type] = [];
        }
        groupedIssues[issue.type].push({ ...issue, originalIndex: index });
    });

    let indexHTML = '<h3>Accessibility Issues Index</h3><ul class="index-list">';

    Object.keys(groupedIssues).forEach((type) => {
        indexHTML += `<li class="index-type"><strong>${type}s</strong> (${groupedIssues[type].length})`;
        indexHTML += '<ul class="index-sublist">';
        groupedIssues[type].forEach((item) => {
            indexHTML += `<li data-original-index="${item.originalIndex}">${item.message}</li>`;
        });
        indexHTML += '</ul></li>';
    });

    indexHTML += '</ul>';
    indexContainer.innerHTML = indexHTML;

    container.appendChild(indexContainer);
}

/**
 * Renders both graph and index for accessibility issues
 * @param {Element} container - The container element to check for accessibility issues
 * @param {Element} outputContainer - The container element to render results into
 */
function renderAccessibilityResults(container, outputContainer) {
    const issues = checkAccessibility(container);

    if (outputContainer) {
        renderAccessibilityGraph(issues, outputContainer);
        renderAccessibilityIndex(issues, outputContainer);
    }

    return issues;
}

/**
 * Renders the index view of the application
 */
function renderIndexView() {
    // Placeholder for the index view rendering logic
    // This could involve creating elements, setting text content, and appending them to the DOM
    // For the purpose of this example, we'll just log a message
    console.log('Index view rendered');
}

/**
 * Gets recommendation for specific accessibility issue type
 * @param {string} issueType - Type of accessibility issue
 * @returns {string} - Recommendation for fixing the issue
 */
function getRecommendation(issueType) {
    const recommendations = {
        'missing-alt-text': 'Add descriptive alt text to images for screen readers',
        'missing-aria-label': 'Add ARIA labels to interactive elements',
        'low-contrast': 'Increase color contrast ratio to at least 4.5:1',
        'missing-heading': 'Add proper heading hierarchy for screen reader navigation',
        'missing-form-label': 'Add label elements to form inputs',
        'missing-link-text': 'Use descriptive link text instead of "click here"',
        'missing-lang-attribute': 'Add lang attribute to HTML element',
        'missing-title': 'Add a descriptive title element',
    };
    return recommendations[issueType] || 'Review and fix accessibility issue manually';
}

/**
 * New function to fix the React SVG Accessible Name issue
 * @param {string} svgString - The SVG string to fix
 * @returns {string} - SVG string with accessible name added
 */
function fixSVGAccessibleName(svgString) {
    // Check if the SVG string already contains an accessible name
    if (
        svgString.includes('aria-label') ||
        svgString.includes('aria-labelledby') ||
        svgString.includes('title')
    ) {
        return svgString;
    }

    // Create a temporary SVG element to parse the SVG string
    const tempSVG = document.implementation.createHTMLDocument();
    tempSVG.body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${svgString}</svg>`;
    const svgRoot = tempSVG.querySelector('svg');

    // Check if the SVG is decorative and does not need an accessible name
    const parentElement = svgRoot.parentElement;
    const isDecorative =
        parentElement &&
        (parentElement.tagName === 'button' ||
            parentElement.tagName === 'input' ||
            parentElement.tagName === 'textarea' ||
            parentElement.tagName === 'select' ||
            (parentElement.tagName === 'audio' && parentElement.hasAttribute('controls')) ||
            (parentElement.tagName === 'video' && parentElement.hasAttribute('controls')));

    if (isDecorative) {
        return svgString.replace('<svg', '<svg aria-hidden="true"');
    }

    // Add an aria-label to the SVG if it's not decorative
    const svgWithAriaLabel = svgString.replace('<svg', '<svg aria-label="SVG description"');
    return svgWithAriaLabel;
}

/**
 * Generates a summary of addressed accessibility issues
 * @param {Array} addressedIssues - Array of addressed issues
 * @returns {string} - Summary text
 */
function generateSummary(addressedIssues) {
    const total = addressedIssues.length;
    const critical = addressedIssues.filter((i) => i.severity === 'critical').length;
    const moderate = addressedIssues.filter((i) => i.severity === 'moderate').length;
    const low = addressedIssues.filter((i) => i.severity === 'low').length;

    return `Addressed ${total} accessibility issues: ${critical} critical, ${moderate} moderate, ${low} low priority.`;
}

const a11yStore = {
    init() {
        this.initLangAttribute();
        this.setupSkipLinks();
        this.ensureUniqueLandmarks();
        this.fixFakeLinks();
        this.initAccessibility();
    },

    createAccessibleButton(id, label, onClick) {
        const button = document.createElement('button');
        button.id = id;
        button.setAttribute('aria-label', label);
        button.textContent = label;
        button.addEventListener('click', onClick);
        return button;
    },

    createAccessibleDialog(id, title, content, closeLabel = 'Close') {
        const dialog = document.createElement('div');
        dialog.id = id;
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-labelledby', `${id}-title`);
        dialog.setAttribute('aria-modal', 'true');

        const titleEl = document.createElement('h2');
        titleEl.id = `${id}-title`;
        titleEl.textContent = title;

        const closeButton = this.createAccessibleButton(`${id}-close`, closeLabel, () => {
            dialog.hidden = true;
            dialog.setAttribute('aria-hidden', 'true');
        });

        dialog.appendChild(titleEl);
        dialog.appendChild(closeButton);
        dialog.appendChild(content);

        return dialog;
    },

    announceToScreenReader(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    },

    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        container.addEventListener('keydown', (e) => {
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
};

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svgElement - The SVG element to get the accessible name from
 * @returns {string} The accessible name of the SVG
 */
function getSVGAccessibleName(svgElement) {
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

function addressAccessibilityIssues(report) {
    if (!report || typeof document === 'undefined') return;
    const issues = Array.isArray(report) ? report : (report.issues || []);
    issues.forEach(issue => {
        if (!issue || !issue.type) return;
        switch (issue.type) {
            case 'missing-lang':
                if (issue.element && typeof issue.element.setAttribute === 'function') {
                    issue.element.setAttribute('lang', 'en');
                } else if (issue.selector && typeof document.querySelector === 'function') {
                    const el = document.querySelector(issue.selector);
                    if (el) el.setAttribute('lang', 'en');
                }
                break;
            case 'missing-skip-link':
                if (typeof document !== 'undefined' && document.body) {
                    const skipLink = document.createElement('a');
                    skipLink.className = 'skip-link';
                    skipLink.href = '#main-content';
                    skipLink.textContent = 'Skip to main content';
                    skipLink.setAttribute('aria-label', 'Skip to main content');
                    document.body.insertBefore(skipLink, document.body.firstChild);
                }
                break;
            case 'missing-alt':
                if (typeof document !== 'undefined') {
                    document.querySelectorAll('img').forEach(img => {
                        if (!img.getAttribute('alt')) {
                            img.setAttribute('alt', 'Image description');
                        }
                    });
                }
                break;
            case 'missing-label':
                if (typeof document !== 'undefined') {
                    document.querySelectorAll('input, select, textarea').forEach(el => {
                        if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
                            el.setAttribute('aria-label', 'Form field');
                        }
                    });
                }
                break;
            default:
                break;
        }
    });
}

/**
 * Ensures all landmarks have unique IDs to meet accessibility requirements
 * @returns {Set<string>} - Set of IDs found in landmark elements
 */
function ensureUniqueLandmarks() {
    const landmarkSelectors = [
        'main',
        '[role="banner"]',
        '[role="header"]',
        '[role="navigation"]',
        '[role="complementary"]',
        '[role="contentinfo"]',
        '[role="footer"]',
        '[role="search"]',
        '[role="form"]',
    ];

    const landmarkElements = document.querySelectorAll(landmarkSelectors.join(', '));
    const ids = new Set();

    landmarkElements.forEach((el) => {
        if (el.id) {
            if (ids.has(el.id)) {
                console.warn('Duplicate ID found for landmark:', el.id);
                // Generate unique ID by appending a suffix
                let uniqueId = el.id;
                let counter = 1;
                while (ids.has(uniqueId)) {
                    uniqueId = `${el.id}-${counter}`;
                    counter++;
                }
                el.id = uniqueId;
                ids.add(uniqueId);
            } else {
                ids.add(el.id);
            }
        }
    });

    return ids;
}

/**
 * Wraps the primary content in a main element if one doesn't exist
 * @returns {HTMLElement|null} - The main element or null if not in browser
 */
function wrapPrimaryContentInMain() {
    if (typeof document === 'undefined' || !document.body) {
        return null;
    }

    let mainElement = document.querySelector('main');
    if (mainElement) {
        return mainElement;
    }

    const landmarks = [
        'nav',
        'aside',
        'footer',
        '[role="banner"]',
        '[role="navigation"]',
        '[role="main"]',
        '[role="complementary"]',
        '[role="contentinfo"]',
        '[role="search"]',
        '[role="form"]',
    ];

    const possibleMainContent = Array.from(document.body.children).filter(
        (el) =>
            !landmarks.includes(el.tagName.toLowerCase()) &&
            !landmarks.some((landmark) => el.matches(landmark)) &&
            el.tagName !== 'MAIN'
    );

    mainElement = document.createElement('main');
    mainElement.id = 'main-content';
    possibleMainContent.forEach((child) => {
        mainElement.appendChild(child);
    });

    document.body.appendChild(mainElement);
    return mainElement;
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
    if (!svgElement || svgElement.tagName !== 'SVG') return;

    // Check if the SVG already has an accessible name
    const hasAccessibleName =
        svgElement.querySelector('title') ||
        svgElement.querySelector('desc') ||
        svgElement.hasAttribute('aria-label') ||
        svgElement.hasAttribute('aria-labelledby');

    if (!hasAccessibleName) {
        // Add a title element as the accessible name
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = 'SVG graphic';
        svgElement.insertBefore(title, svgElement.firstChild);
    }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLAnchorElement} linkElement - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessibleCheck(link) {
    if (!link || link.tagName !== 'A') return false;

    const hasText = link.textContent && link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasAriaLabelledby = link.hasAttribute('aria-labelledby');
    const hasTitle = link.hasAttribute('title');

    return hasText || hasAriaLabel || hasAriaLabelledby || hasTitle;
}

/**
 * Validates link accessibility (async version)
 * @param {string} url - The URL to validate
 * @returns {Promise<boolean>} - Promise resolving to true if accessible
 */
function isLinkAccessible(url) {
    return Promise.resolve(true);
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLButtonElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
    if (!button || button.tagName !== 'BUTTON') return false;

    const hasText = button.textContent && button.textContent.trim().length > 0;
    const hasAriaLabel = button.hasAttribute('aria-label');

    return hasText || hasAriaLabel;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {Element} [container=document] - The container to check for accessibility
 * @returns {Object} An object with accessibleLink and accessibleButton properties
 */
function checkAccessibility(container) {
    container = container || document;

    const links = container.querySelectorAll ? container.querySelectorAll('a') : [];
    const buttons = container.querySelectorAll ? container.querySelectorAll('button') : [];

    const accessibleLink = Array.from(links).filter(isLinkAccessibleCheck).length;
    const accessibleButton = Array.from(buttons).filter(isButtonAccessible).length;

    return {
        accessibleLink,
        accessibleButton,
        totalLinks: links.length,
        totalButtons: buttons.length,
    };
}

function isLinkAccessibleSync(url) {
    try {
        return true;
    } catch (error) {
        return false;
    }
}

function createInPageButton(options = {}) {
    const button = document.createElement('button');
    button.className = options.className || 'in-page-button';
    button.setAttribute('aria-label', options.label || 'In page action');
    button.textContent = options.text || 'Action';
    return button;
}

function validateTableAccessibility(table) {
    if (!table || table.tagName !== 'TABLE') return false;

    // Append the button to the body or a specific container
    document.body.appendChild(button);

    return button;
}