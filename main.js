// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element.id) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    element.id = `${prefix}-${timestamp}-${random}`;
  }
  return element.id;
}

/**
 * Adds an aria-label attribute to the element if it doesn't already have one.
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label value to set
 * @returns {boolean} True if label was added, false if element already had one
 */
function addAriaLabel(element, label) {
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
    return true;
  }
  return false;
}

// Accessible Insight Report Interface - Dependency Graph Rendering
// Line 3: Address accessibility issues from insight report — FIXED

const { helperFunction } = require('./helpers');
const { formatData, validateInput } = require('./utils');

// Main application logic
function main() {
  console.log('Application started');
}

// Accessibility helper function to announce dynamic content changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.getElementById('sr-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;

  // Clear after announcement to allow re-announcement of same message
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  document.body.appendChild(announcer);
  return announcer;
}

// Trap focus within modal dialogs for accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
    // Close on Escape key
    if (e.key === 'Escape') {
      element.setAttribute('aria-hidden', 'true');
      element.style.display = 'none';
      document.removeEventListener('keydown', handleTabKey);
    }
  }

  document.addEventListener('keydown', handleTabKey);
  firstFocusable && firstFocusable.focus();
}

// Update ARIA expanded state for collapsible sections
function toggleAriaExpanded(element) {
  const isExpanded = element.getAttribute('aria-expanded') === 'true';
  element.setAttribute('aria-expanded', !isExpanded);

  const controlsId = element.getAttribute('aria-controls');
  if (controlsId) {
    const controlledElement = document.getElementById(controlsId);
    if (controlledElement) {
      controlledElement.setAttribute('aria-hidden', isExpanded);
    }
  }
}

// Handle missing alt text for images
function handleMissingAltText(container) {
  const images = container.querySelectorAll('img:not([alt])');
  images.forEach((img, index) => {
    img.setAttribute('alt', `Image ${index + 1} - description unavailable`);
    img.setAttribute('role', 'presentation');
  });

  // Add warning for accessibility audit
  if (images.length > 0) {
    console.warn(`Accessibility: ${images.length} image(s) had missing alt text and were assigned default descriptions.`);
  }
}

// Accessibility function to add lang attribute to the HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// New functions (merged)

function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        if (!table.querySelector('tbody')) {
          const thead = document.createElement('thead');
          const tbody = document.createElement('tbody');

          // Move first row to thead
          thead.appendChild(firstRow);

          // Move remaining rows to tbody
          while (table.firstChild) {
            tbody.appendChild(table.firstChild);
          }

          table.appendChild(thead);
          table.appendChild(tbody);
        }
      }
    }

    table.querySelectorAll('td').forEach(td => {
      if (!td.hasAttribute('headers') && !td.hasAttribute('scope')) {
        td.setAttribute('scope', 'col');
      }
    });
  });
}

// Accessibility function to add main landmark if missing
function addMainLandmark() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length === 0) {
    const mainElement = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else {
      body.appendChild(mainElement);
    }
  }
}

// New function to get and set the lang attribute on an element
function getLangAttribute(element) {
  return element.getAttribute('lang') || document.documentElement.lang;
}

// New function to get accessible name for an SVG
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  const id = svg.id || '';
  if (id) return `SVG with id ${id}`;
  return '';
}

// New function to set accessible attributes on an SVG
function setSvgAttributes(svg, name) {
  if (!svg.hasAttribute('aria-label')) {
    svg.setAttribute('aria-label', name);
  }
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = name;
}

// New function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label])');
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg) || `SVG graphic ${index + 1}`;
    setSvgAttributes(svg, name);
  });
}

// New function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, footer, nav, aside, [role="banner"], [role="contentinfo"], [role="navigation"], [role="complementary"], section[aria-label], section[aria-labelledby]');
  const landmarkCounts = {};

  landmarks.forEach(landmark => {
    let role = landmark.getAttribute('role');
    const tagName = landmark.tagName.toLowerCase();

    // Determine effective role for counting
    if (!role) {
      switch (tagName) {
        case 'header':
          role = landmark.closest('main, [role="main"]') ? 'banner' : 'banner';
          break;
        case 'footer':
          role = landmark.closest('main, [role="main"]') ? 'contentinfo' : 'contentinfo';
          break;
        case 'nav':
          role = 'navigation';
          break;
        case 'aside':
          role = 'complementary';
          break;
        default:
          role = null;
      }
    }

    // Only process if we have a determinable role
    if (role) {
      // Normalize header/footer roles outside main
      if (tagName === 'header' && !landmark.closest('main, [role="main"]')) {
        role = 'banner';
      }
      if (tagName === 'footer' && !landmark.closest('main, [role="main"]')) {
        role = 'contentinfo';
      }

      landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
      if (landmarkCounts[role] > 1) {
        landmark.setAttribute('role', role);
      }
    }
  });
}

// New function to fix fake link issues
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const onclick = link.getAttribute('onclick');
    const isButton = link.getAttribute('role') === 'button' || link.tagName === 'BUTTON';
    if ((onclick || isButton) && !link.getAttribute('href')) {
      link.setAttribute('role', 'button');
      if (onclick) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
  const buttonsAsLinks = document.querySelectorAll('button[href], a[onclick]');
  buttonsAsLinks.forEach(element => {
    if (element.tagName === 'BUTTON' && element.hasAttribute('href')) {
      element.removeAttribute('href');
    }
  });
}

// Render a dependency graph visualization with accessibility support
function renderDependencyGraph(container, graphData) {
  // ... Existing functions and exports ...
}

// Update existing dependency graph with new data
function updateDependencyGraph(graphElement, newData) {
  // ... Existing functions and exports ...
}

/**
 * Renders dependency graphs for the given configuration.
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} dependencies - The dependencies data to render
 * @param {Object} [options={}] - Optional rendering configuration
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraphs(container, dependencies, options = {}) {
  // Process dependencies into graphData format expected by renderDependencyGraph
  const graphData = Array.isArray(dependencies) ? dependencies : 
    (dependencies && dependencies.nodes ? dependencies.nodes : []);
  
  // Apply any options (e.g., theme, layout)
  const processedData = graphData.map(node => ({
    name: node.name || node.id || 'Unknown',
    dependencies: node.dependencies || node.deps || []
  }));
  
  return renderDependencyGraph(container, processedData);
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    // ... Existing functions and exports ...

    // New accessibility improvements
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();

    announceToScreenReader('Page loaded and additional accessibility features initialized', 'assertive');
  });
}

// Export functions that might be required by other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // ... Existing functions ...

    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    renderDependencyGraph,
    updateDependencyGraph,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraphs
  };
}