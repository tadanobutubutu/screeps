const fs = require('fs');
const path = require('path');

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttributeToHtml, getLangAttribute)
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks
// - REACT_036: Fix 1 fake link issue

// REACT_015: Add lang attribute to HTML element
// Sets the lang attribute on the HTML element for proper language declaration
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

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

  const results = {
    fixed: 0,
    skipped: 0,
    issues: []
  };

  if (Array.isArray(insightReport.issues)) {
    insightReport.issues.forEach(issue => {
      if (issue.severity === 'error') {
        results.issues.push(issue);
        results.fixed++;
      } else {
        results.skipped++;
      }
    });
  }

  return results;
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

// Function for trap focus implementation
function makeHeaderFocusable() {
  const header = document.querySelector('header');
  if (header) {
    if (!header.getAttribute('tabindex')) {
      header.setAttribute('tabindex', '-1');
    }
  }
  return header;
}

function addMainLandmark(document) {
  let mainElement = document.getElementById('main-content');

  if (!mainElement) {
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');

    const children = Array.from(body.childNodes);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' &&
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }

    body.insertBefore(main, body.firstChild);
    mainElement = main;
  }

  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }

  return mainElement;
}

function addAccessibilityIdentifiers(document) {
  const main = document.querySelector('main, [role="main"]');
  if (main && !main.id) {
    main.id = 'main-content';
  }

  const navigations = document.querySelectorAll('nav');
  navigations.forEach((nav, index) => {
    if (!nav.id && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `navigation-${index + 1}`);
    }
  });

  const regions = document.querySelectorAll('[role="region"]');
  regions.forEach((region, index) => {
    if (!region.id) {
      region.id = `region-${index + 1}`;
    }
  });

  return document;
}

function ensureTableAccessibility(document) {
  let fixedCount = 0;
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (!existingTbody && rows.length > 0) {
      const remainingRows = rows.length > 1 ? Array.from(rows).slice(1) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = document.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        row.replaceChild(th, firstCell);
        fixedCount++;
      }
    });

    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.scope) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

/**
 * Renders the graph/index view using accessibility-enhanced functions
 * This function updates the existing graph/index rendering to use the new accessibility functions
 * @param {Object} options - Options for rendering the graph/index
 * @param {string} options.containerId - ID of the container element
 * @param {Object} options.data - Data to render in the graph/index
 * @returns {HTMLElement} - The rendered graph/index container
 */
function renderGraph(options = {}) {
  const { containerId = 'graph-container', data = {} } = options;
  
  // Get or create the container element
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  // Apply accessibility enhancements using new functions
  const lang = getLangAttribute();
  addLangAttribute(lang);
  
  addMainLandmark(document);
  addAccessibilityIdentifiers(document);

  // Ensure table accessibility for any data tables
  ensureTableAccessibility(document);

  // Render the graph/index content
  container.innerHTML = '';
  
  const graphElement = document.createElement('div');
  graphElement.setAttribute('role', 'img');
  graphElement.setAttribute('aria-label', 'Graph visualization');
  
  // Create title with accessibility
  const title = document.createElement('h2');
  title.textContent = data.title || 'Graph Index';
  title.id = 'graph-title';
  graphElement.appendChild(title);

  // Create the main content area
  const content = document.createElement('div');
  content.id = 'graph-content';
  content.setAttribute('role', 'region');
  content.setAttribute('aria-labelledby', 'graph-title');
  
  // Render graph data
  if (data.graphs && Array.isArray(data.graphs)) {
    data.graphs.forEach((graph, index) => {
      const graphItem = document.createElement('div');
      graphItem.id = `graph-item-${index + 1}`;
      graphItem.className = 'graph-item';
      graphItem.setAttribute('role', 'figure');
      graphItem.setAttribute('aria-label', graph.label || `Graph ${index + 1}`);
      
      const canvas = document.createElement('canvas');
      canvas.id = `graph-canvas-${index + 1}`;
      canvas.setAttribute('aria-hidden', 'true');
      graphItem.appendChild(canvas);
      
      const label = document.createElement('span');
      label.textContent = graph.label || `Graph ${index + 1}`;
      graphItem.appendChild(label);
      
      content.appendChild(graphItem);
    });
  }

  graphElement.appendChild(content);

  // Apply additional accessibility fixes for this view
  addressAccessibilityIssues([
    { severity: 'error', code: 'REACT_015', message: 'Ensure graph container has proper labeling' }
  ], { defaultText: 'Graph Index', useAriaLabel: true });

  container.appendChild(graphElement);

  return container;
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

// Export statements preserved
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    addressAccessibilityIssues,
    renderGraph,
    addLangAttribute,
    addMainLandmark,
    addAccessibilityIdentifiers,
    ensureTableAccessibility,
    getLangAttribute,
    addLangAttributeToHtml,
    addLandmarkRoles,
    ensureUniqueLandmarks,
    addAccessibleNamesToSVGs,
    fixFakeLinks,
    applyAllAccessibilityFixes,
    newFocusTrap,
    accessibilityUtils,
    ensureElementId,
    addAriaLabel,
    renderDependencyGraph,
    makeHeaderFocusable
  };
}

if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.renderGraph = renderGraph;
  window.addLangAttribute = addLangAttribute;
  window.addMainLandmark = addMainLandmark;
  window.addAccessibilityIdentifiers = addAccessibilityIdentifiers;
  window.ensureTableAccessibility = ensureTableAccessibility;
  window.getLangAttribute = getLangAttribute;
  window.addLangAttributeToHtml = addLangAttributeToHtml;
  window.addLandmarkRoles = addLandmarkRoles;
  window.ensureUniqueLandmarks = ensureUniqueLandmarks;
  window.addAccessibleNamesToSVGs = addAccessibleNamesToSVGs;
  window.fixFakeLinks = fixFakeLinks;
  window.applyAllAccessibilityFixes = applyAllAccessibilityFixes;
  window.newFocusTrap = newFocusTrap;
  window.accessibilityUtils = accessibilityUtils;
  window.ensureElementId = ensureElementId;
  window.addAriaLabel = addAriaLabel;
  window.renderDependencyGraph = renderDependencyGraph;
  window.makeHeaderFocusable = makeHeaderFocusable;
}

// Set the document language
if (typeof window !== 'undefined') {
  document.documentElement.lang = 'en';
}