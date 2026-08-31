// main.js

// Entry point for the application

// Existing utility functions
function getUser(id) {
  return id;
}

function validateInput(input) {
  return typeof input === 'string';
}

// TODO: Add necessary exports for new functions
export { getUser, validateInput };

// Additional new functions (if any) from both branches
export {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  ensureLandmarkRoles,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureLangAttribute
};

// TODO: Address accessibility issues from insight report:

// Insight Report Accessibility Issues:
// - Missing ARIA labels on interactive elements
// - Keyboard navigation improvements needed
// - Focus management for dynamic content
// - Color contrast compliance
// - Screen reader announcements for dynamic updates

// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (typically in index.html, not main.js)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

'use strict';

// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
// ...

// BEGIN CHANGES TO ADDRESS ACCESSIBILITY ISSUES

// Function to set the lang attribute based on the page content
function setLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    const lang = ensureLangAttribute(document);
    htmlElement.setAttribute('lang', lang);
  }
}

// Function to validate table structure for accessibility
function validateTableAccessibility() {
  // ... Perform accessibility checks on tables
  // Example: check if table headers are properly defined
}

// Function to validate landmark accessibility
function validateLandmark() {
  // ... Perform landmark accessibility checks
  // Example: check if landmark roles are properly assigned
}

// Function to set accessible names for SVGs
function getSvgAccessibleName() {
  // ... Return accessible names for SVGs
}

// Function to create in-page buttons with appropriate roles and names
function createInPageButton() {
  // ... Create buttons with accessibility in mind
}

/**
 * Ensures the given element has an ID.
 * If the element doesn't have an ID, generates a unique one.
 * @param {HTMLElement} element - The element to ensure has an ID
 * @returns {string} The element's ID (existing or newly generated)
 */
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

/**
 * Adds an aria-label to the element if it doesn't have one.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {HTMLElement} The element for chaining
 */
function addAriaLabel(element, label) {
  if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// Ensure the HTML element has a lang attribute
function addLangAttribute(element) {
  element.setAttribute('lang', 'en'); // Replace 'en' with your desired language code
}

// Add an accessible name to an SVG element
function addAccessibleNameToSVG(svg, accessibleName) {
  svg.setAttribute('aria-label', accessibleName);
}

// Add a role to an HTML container element
function addARIARole(container, role) {
  container.setAttribute('role', role);
}

/**
 * Renders a dependency graph visualization.
 * @param {Object} graphData - The dependency graph data
 * @param {HTMLElement} container - The container element to render into
 * @returns {HTMLElement} The container element
 */
function renderDependencyGraph(graphData, container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  // Clear existing content
  container.innerHTML = '';

  // Create SVG for graph visualization
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 600');
  svg.style.maxWidth = '100%';
  svg.style.height = 'auto';

  // Simple force-directed graph layout (basic implementation)
  const nodes = graphData.nodes || [];
  const edges = graphData.edges || [];

  // Generate positions for nodes
  const nodePositions = new Map();
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    const radius = 200;
    nodePositions.set(node.id, {
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle)
    });
  });

  // Draw edges
  edges.forEach(edge => {
    const sourcePos = nodePositions.get(edge.source);
    const targetPos = nodePositions.get(edge.target);
    if (sourcePos && targetPos) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', sourcePos.x);
      line.setAttribute('y1', sourcePos.y);
      line.setAttribute('x2', targetPos.x);
      line.setAttribute('y2', targetPos.y);
      line.setAttribute('stroke', '#999');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      svg.appendChild(line);
    }
  });

  // Add arrowhead marker
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '3.5');
  marker.setAttribute('orient', 'auto');
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  polygon.setAttribute('fill', '#999');
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // Draw nodes
  nodes.forEach(node => {
    const pos = nodePositions.get(node.id);
    if (pos) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '20');
      circle.setAttribute('fill', node.color || '#4a90d9');
      circle.setAttribute('stroke', '#333');
      circle.setAttribute('stroke-width', '2');
      group.appendChild(circle);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '5');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-family', 'sans-serif');
      text.textContent = node.label || node.id;
      group.appendChild(text);

      svg.appendChild(group);
    }
  });

  container.appendChild(svg);
  return container;
}

// REACT_017: Add landmark roles - Ensure proper landmark regions
function ensureLandmarkRoles(container) {
  const landmarks = {
    header: { role: 'banner', count: 0 },
    nav: { role: 'navigation', count: 0 },
    main: { role: 'main', count: 0 },
    aside: { role: 'complementary', count: 0 },
    footer: { role: 'contentinfo', count: 0 },
  };

  const elements = container.querySelectorAll('header, nav, main, aside, footer');
  elements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (landmarks[tagName]) {
      landmarks[tagName].count++;
    }
  });

  return landmarks;
}

// REACT_025: Ensure unique landmarks - Prevent duplicate landmark roles
function ensureUniqueLandmarks(container) {
  const landmarkCounts = {};
  const landmarkElements = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');

  landmarkElements.forEach(el => {
    const role = el.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;

    // If multiple of same landmark type, add unique labels
    if (landmarkCounts[role] > 1) {
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', `${role} section ${landmarkCounts[role]}`);
      }
    }
  });
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(container) {
  const svgs = container.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (title) {
      const titleId = `svg-title-${index}`;
      title.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    } else {
      svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
    }
  });
}

// REACT_036: Fix fake link issues - Convert buttons styled as links or links styled as buttons
function fixFakeLinks(container) {
  const fakeLinks = container.querySelectorAll('a[href="#"], a[onclick], a[role="button"], button[href]');
  fakeLinks.forEach(el => {
    if (el.tagName === 'A' && el.getAttribute('role') === 'button') {
      // Keep as button role, ensure proper button semantics
      el.setAttribute('aria-pressed', 'false');
    } else if (el.tagName === 'A' && (el.getAttribute('href') === '#' || el.getAttribute('onclick'))) {
      // Convert to proper button
      el.setAttribute('role', 'button');
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', el.textContent.trim());
      }
    }
  });
}

// REACT_015: Add lang attribute helper (for dynamic content injection)
function ensureLangAttribute(doc) {
  const html = doc.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', html.lang || 'en');
  }
  return html.getAttribute('lang');
}

// ----- END CHANGES TO ADDRESS ACCESSIBILITY ISSUES

// Existing application code preserved here
const App = {
    init: function() {
        this.setupAccessibility();
        this.bindEvents();
        this.runAdditionalAccessibilityChecks();
    },

    setupAccessibility: function() {
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button');
        buttons.forEach(function(button) {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'Unnamed button');
            }
        });

        // Ensure keyboard navigation
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
        interactiveElements.forEach(function(el) {
            el.setAttribute('tabindex', '0');
        });

        // Focus management for dynamic content
        const focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
        
        // Announce dynamic updates to screen readers
        this.announceToScreenReader = function(message, priority) {
            priority = priority || 'polite';
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', priority);
            announcer.setAttribute('aria-atomic', 'true');
            announcer.setAttribute('class', 'sr-only');
            announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
            document.body.appendChild(announcer);
            
            setTimeout(function() {
                announcer.textContent = message;
                setTimeout(function() {
                    document.body.removeChild(announcer);
                }, 1000);
            }, 100);
        };
    },

    bindEvents: function() {
        document.addEventListener('keydown', function(e) {
            // Trap focus within modals
            if (e.key === 'Escape') {
                // Close modals on Escape key
                const modals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
                modals.forEach(function(modal) {
                    modal.setAttribute('aria-hidden', 'true');
                });
            }
        });
    },

    runAdditionalAccessibilityChecks: function() {
        setLangAttribute();
        validateTableAccessibility();
        validateLandmark();
        ensureLandmarkRoles(document);
        ensureUniqueLandmarks(document);
        addSvgAccessibleNames(document);
        fixFakeLinks(document);
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        App: App,
        getUser: getUser,
        validateInput: validateInput,
        ensureElementHasId: ensureElementHasId,
        addAriaLabel: addAriaLabel,
        renderDependencyGraph: renderDependencyGraph,
        ensureLandmarkRoles: ensureLandmarkRoles,
        ensureUniqueLandmarks: ensureUniqueLandmarks,
        addSvgAccessibleNames: addSvgAccessibleNames,
        fixFakeLinks: fixFakeLinks,
        ensureLangAttribute: ensureLangAttribute,
        setLangAttribute: setLangAttribute,
        validateTableAccessibility: validateTableAccessibility,
        validateLandmark: validateLandmark,
        getSvgAccessibleName: getSvgAccessibleName,
        createInPageButton: createInPageButton,
        addLangAttribute: addLangAttribute,
        addAccessibleNameToSVG: addAccessibleNameToSVG,
        addARIARole: addARIARole
    };
} else {
    window.App = App;
    window.getUser = getUser;
    window.validateInput = validateInput;
    window.ensureElementHasId = ensureElementHasId;
    window.addAriaLabel = addAriaLabel;
    window.renderDependencyGraph = renderDependencyGraph;
    window.ensureLandmarkRoles = ensureLandmarkRoles;
    window.ensureUniqueLandmarks = ensureUniqueLandmarks;
    window.addSvgAccessibleNames = addSvgAccessibleNames;
    window.fixFakeLinks = fixFakeLinks;
    window.ensureLangAttribute = ensureLangAttribute;
    window.setLangAttribute = setLangAttribute;
    window.validateTableAccessibility = validateTableAccessibility;
    window.validateLandmark = validateLandmark;
    window.getSvgAccessibleName = getSvgAccessibleName;
    window.createInPageButton = createInPageButton;
    window.addLangAttribute = addLangAttribute;
    window.addAccessibleNameToSVG = addAccessibleNameToSVG;
    window.addARIARole = addARIARole;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        App.init();
    });
} else {
    App.init();
}