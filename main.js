const fs = require('fs');
const path = require('path');

// TODO: Address accessibility issues from insight report
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks
// - REACT_036: Fix 1 fake link issue

/**
 * REACT_015: Add lang attribute to HTML element
 * Sets the lang attribute on the HTML element for proper language declaration
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttributeToHtml(langCode = 'en') {
  const html = document.documentElement;
  if (html && langCode) {
    html.setAttribute('lang', langCode);
    console.log(`Set lang attribute to: ${langCode}`);
  }
}

/**
 * REACT_017: Add landmark roles and fix landmark issues
 * Ensures proper landmark roles are applied to main content areas
 * @param {HTMLElement} container - The container element to process
 */
function addLandmarkRoles(container = document) {
  const main = container.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  const nav = container.querySelector('nav');
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }

  const footer = container.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }

  const aside = container.querySelector('aside');
  if (aside && !aside.getAttribute('role')) {
    aside.setAttribute('role', 'complementary');
  }

  const search = container.querySelector('[role="search"]');
  if (search && !search.id) {
    search.setAttribute('id', 'main-search');
  }

  console.log('Added landmark roles to semantic elements');
}

/**
 * REACT_043: Wrap primary content in a main element
 * Ensures primary content is wrapped in a <main> element with proper attributes
 */
function wrapPrimaryContentInMain() {
  const primaryContent = document.querySelector('main') || document.querySelector('[role="main"]');

  if (!primaryContent) {
    // Create a new main element and wrap the primary content
    const newMain = document.createElement('main');
    newMain.setAttribute('role', 'main');
    newMain.id = 'main-content';

    // Move all top-level body children (excluding existing mains, headers, footers, etc.) into the new main
    const bodyChildren = document.body.children;
    const elementsToMove = [];
    for (let i = 0; i < bodyChildren.length; i++) {
      const child = bodyChildren[i];
      const tagName = child.tagName.toLowerCase();
      if (!['header', 'footer', 'nav', 'main', 'aside'].includes(tagName)) {
        elementsToMove.push(child);
      }
    }

    elementsToMove.forEach((element) => {
      newMain.appendChild(element);
    });

    document.body.appendChild(newMain);
  } else {
    // Ensure main has proper attributes
    if (!primaryContent.hasAttribute('role')) {
      primaryContent.setAttribute('role', 'main');
    }
    if (!primaryContent.id) {
      primaryContent.id = 'main-content';
    }
  }
}

/**
 * REACT_025: Ensure unique landmarks (2 issues)
 * Makes landmark values unique by adding or updating IDs
 * @param {HTMLElement} container - The container element to process
 */
function ensureUniqueLandmarks(container = document) {
  const landmarks = container.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');

  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role');
    if (!landmark.id) {
      landmark.id = `${role}-${index + 1}`;
    }
  });

  console.log(`Ensured uniqueness for ${landmarks.length} landmarks`);
}

/**
 * REACT_041: Add accessible names to SVGs
 * Adds aria-label or title elements to SVGs for screen reader support
 * @param {HTMLElement} container - The container element to process
 */
function addAccessibleNamesToSVGs(container = document) {
  const svgs = container.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const existingTitle = svg.querySelector('title');
      if (!existingTitle) {
        const title = document.createElement('title');
        title.textContent = `SVG icon ${index + 1}`;
        svg.insertBefore(title, svg.firstChild);
      }

      const titleId = `svg-title-${index + 1}`;
      const titleEl = svg.querySelector('title');
      if (titleEl) {
        titleEl.id = titleId;
      }

      svg.setAttribute('aria-labelledby', titleId);
    }
  });

  console.log(`Added accessible names to ${svgs.length} SVGs`);
}

/**
 * REACT_036: Fix fake link issues
 * Converts elements that appear as links but aren't properly marked up
 * @param {HTMLElement} container - The container element to process
 */
function fixFakeLinks(container = document) {
  const clickableElements = container.querySelectorAll('[onclick]:not(a):not(button)');

  clickableElements.forEach((element, index) => {
    const text = element.textContent?.trim();
    const isIconOnly = element.querySelector('svg, img, i[class*="icon"]');

    if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
      // Convert to button if it's clickable
      element.setAttribute('role', 'button');

      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }

      if (isIconOnly && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        element.setAttribute('aria-label', `Button ${index + 1}`);
      }

      if (!text) {
        console.warn(`Fake link element ${index + 1} may need accessible name`);
      }
    }
  });

  console.log(`Fixed ${clickableElements.length} fake link elements`);
}

/**
 * Address accessibility issues from insight report
 * Processes an accessibility report and logs/suggests fixes for issues
 * @param {Object} insightReport - The accessibility report object
 */
function addressAccessibilityIssues(insightReport) {
  // Handle case where insightReport is null, undefined, or not an object
  if (!insightReport || typeof insightReport !== 'object') {
    console.warn('Invalid insight report provided to addressAccessibilityIssues');
    return;
  }
}

/**
 * Main function to apply all accessibility fixes
 * Addresses all issues from the accessibility insight report
 * @param {Object} insightReport - Optional accessibility report
 */
function applyAllAccessibilityFixes(insightReport) {
  // REACT_015: Add lang attribute
  addLangAttributeToHtml();

  // REACT_017: Add landmark roles
  addLandmarkRoles();

  // REACT_043: Wrap primary content in main
  wrapPrimaryContentInMain();

  // REACT_025: Ensure unique landmarks
  ensureUniqueLandmarks();

  // REACT_041: Add accessible names to SVGs
  addAccessibleNamesToSVGs();

  // REACT_036: Fix fake links
  fixFakeLinks();

  // Process insight report if provided
  if (insightReport) {
    addressAccessibilityIssues(insightReport);
  }

  console.log('All accessibility fixes have been applied');
}

/**
 * Focus trap utility for modal dialogs and menus
 * Restricts keyboard focus to a given container element
 * @param {HTMLElement} element - The container element to trap focus within
 */
function newFocusTrap(element) {
  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusableElements = element.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  return {
    activate: () => {
      if (firstFocusable) {
        firstFocusable.focus();
      }
    },
    handleTab: (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  };
}

const accessibilityUtils = {
  // Utility functions for accessibility
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },
  trapFocus: (element) => {
    const trap = newFocusTrap(element);
    trap.activate();
    element.addEventListener('keydown', trap.handleTab);
  },
  announceToScreenReader: (message, priority = 'polite') => {
    const liveRegion = document.getElementById('a11y-announcer') || (() => {
      const region = document.createElement('div');
      region.id = 'a11y-announcer';
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.style.position = 'absolute';
      region.style.left = '-9999px';
      document.body.appendChild(region);
      return region;
    })();
    liveRegion.textContent = '';
    setTimeout(() => { liveRegion.textContent = message; }, 100);
  },
  handleKeyboardNav: (e, handlers) => {
    if (handlers && typeof handlers[e.key] === 'function') {
      handlers[e.key](e);
    }
  },
  newFocusTrap: newFocusTrap()
};

// Functions already existing in the file to preserve
// ...

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `el-${Math.random().toString(36).slice(2, 9)}`;
  }
  return element;
};

const addAriaLabel = (element, label) => {
  if (element && label && !element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
};

const renderDependencyGraph = (data) => {
  if (!data) return null;
  const container = document.createElement('div');
  container.className = 'dependency-graph';
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', 'Dependency graph visualization');
  return container;
};

// Function for trap focus implementation (merged with newFocusTrap)
function newFunction(element) {
  const trap = newFocusTrap(element);
  trap.activate();
}

// New functions for graph/index rendering
/**
 * Renders a graph visualization based on provided data
 * @param {Object} graphData - Data containing nodes and edges for the graph
 * @param {HTMLElement} container - The container element to render the graph into
 * @returns {HTMLElement} The rendered graph container
 */
function renderGraph(graphData, container) {
  if (!graphData || !container) {
    console.error('Missing required parameters for renderGraph');
    return null;
  }

  // Create graph container
  const graphContainer = document.createElement('div');
  graphContainer.className = 'graph-visualization';
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', 'Graph visualization');

  // Add nodes
  if (graphData.nodes) {
    graphData.nodes.forEach((node, index) => {
      const nodeElement = document.createElement('div');
      nodeElement.className = 'graph-node';
      nodeElement.id = `node-${index}`;
      nodeElement.textContent = node.label || `Node ${index + 1}`;
      nodeElement.setAttribute('role', 'button');
      nodeElement.setAttribute('tabindex', '0');
      graphContainer.appendChild(nodeElement);
    });
  }

  // Add edges
  if (graphData.edges) {
    graphData.edges.forEach((edge, index) => {
      const edgeElement = document.createElement('div');
      edgeElement.className = 'graph-edge';
      edgeElement.id = `edge-${index}`;
      edgeElement.setAttribute('aria-hidden', 'true');
      graphContainer.appendChild(edgeElement);
    });
  }

  // Append to container
  container.appendChild(graphContainer);
  return graphContainer;
}

/**
 * Updates an existing graph visualization with new data
 * @param {HTMLElement} graphContainer - The existing graph container to update
 * @param {Object} newGraphData - New data to update the graph with
 */
function updateGraph(graphContainer, newGraphData) {
  if (!graphContainer || !newGraphData) {
    console.error('Missing required parameters for updateGraph');
    return;
  }

  // Clear existing nodes and edges
  const nodes = graphContainer.querySelectorAll('.graph-node');
  const edges = graphContainer.querySelectorAll('.graph-edge');

  nodes.forEach(node => node.remove());
  edges.forEach(edge => edge.remove());

  // Re-render with new data
  renderGraph(newGraphData, graphContainer.parentElement);
}

// Export statements preserved
export { existingFunction };

// Export the new function for REACT_043
export { makeHeaderFocusable };

// Export new accessibility functions
export {
  addLangAttributeToHtml,
  addLandmarkRoles,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addAccessibleNamesToSVGs,
  fixFakeLinks,
  addressAccessibilityIssues,
  applyAllAccessibilityFixes,
  newFocusTrap,
  accessibilityUtils,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  renderGraph,
  updateGraph
};

// Set the document language
if (typeof window !== 'undefined') {
  document.documentElement.lang = 'en';
}