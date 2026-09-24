// TODO: This is the existing code that needs to be preserved
// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (typically in index.html, not main.js)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// - REACT_041: Add accessible names to 2 SVGs
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Accessibility utilities

/**
 * Sets the lang attribute on an element with validation
 * REACT_015: Address lang attribute accessibility requirement
 * @param {HTMLElement} element - The target element
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
 * @param {HTMLElement} element - The target element
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
 * @param {HTMLElement} element - The target element
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

    const result = {
        nodes: nodes,
        edges: edges,
        container: container,
        render: function (target) {
            if (target && typeof target.render === 'function') {
                target.render(this.nodes, this.edges);
            }
        },
    };

    // Ensure dependency graph has proper ARIA attributes after rendering
    if (typeof document !== 'undefined') {
        ensureDependencyGraphARIA();
    }

    return result;
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

    // Update dependency graph ARIA attributes
    if (typeof document !== 'undefined') {
        ensureDependencyGraphARIA();
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

// Validate the accessibility report for issues
function validateAccessibilityReport(report) {
  if (!report || !Array.isArray(report)) {
    return false;
  }
  for (let i = 0; i < report.length; i++) {
    const issue = report[i];
    if (!issue || typeof issue.type !== 'string' || typeof issue.message !== 'string') {
      return false;
    }
  }
  return true;
}

// REACT_017: Add landmark roles and fix landmark issues
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
      el.setAttribute('role', landmarks[tagName].role);
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

// REACT_041: Add accessible names to 2 SVGs
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
function ensureLangAttribute(document) {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', document.documentElement.lang || 'en');
  }
  return html.getAttribute('lang');
}

// Export all functions for testing
export {
  ensureLandmarkRoles,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureLangAttribute,
  newFunction // Export the new function
};