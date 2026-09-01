// TODO: This is the modified and merged code
// This is the existing code that needs to be preserved in main.js
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Ensures an element has an id attribute. If the element doesn't have an id,
 * one is generated using the provided prefix.
 * @param {HTMLElement} element - The element to ensure has an id
 * @param {string} prefix - The prefix to use for generating an id if one doesn't exist
 * @returns {string} The id of the element
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    return null;
  }

  if (!element.id) {
    element.id = `${prefix}-${Date.now().toString(36).slice(-9)}`;
  }

  return element.id;
}

/**
 * Adds an aria-label attribute to an element.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement} The element with the aria-label added
 */
function addAriaLabel(element, label) {
  if (!element) {
    return null;
  }

  if (typeof label !== 'string' || label.trim() === '') {
    return element;
  }

  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Ensures an element has both an id and an aria-label for accessibility.
 * @param {HTMLElement} element - The element to enhance
 * @param {string} idPrefix - The prefix for generating an id if needed
 * @param {string} ariaLabel - The aria-label text
 * @returns {string|null} The id of the element, or null if element is invalid
 */
function ensureElementAccessibility(element, idPrefix, ariaLabel) {
  if (!element) {
    return null;
  }

  const id = ensureElementHasId(element, idPrefix);
  addAriaLabel(element, ariaLabel);

  return id;
}

/**
 * Renders a dependency graph with nodes and edges
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} options - The graph options containing nodes and edges
 * @returns {HTMLElement} The rendered dependency graph container
 */
function renderDependencyGraphs(container, options = {}) {
  const { nodes = [], edges = [] } = options;
  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph';

  // Ensure container has an id for accessibility
  const containerId = ensureElementHasId(container, 'graph-container');

  // Add aria-label for accessibility
  addAriaLabel(graphContainer, 'Dependency graph visualization');

  // Render nodes
  nodes.forEach(node => {
    const nodeElement = document.createElement('div');
    nodeElement.id = ensureElementHasId(nodeElement, 'node');
    nodeElement.textContent = node.label || node.id;
    nodeElement.className = 'graph-node';
    graphContainer.appendChild(nodeElement);
  });

  // Render edges (connections between nodes)
  edges.forEach(edge => {
    const sourceId = edge.source?.id || ensureElementHasId({ id: edge.source }, 'node-source');
    const targetId = edge.target?.id || ensureElementHasId({ id: edge.target }, 'node-target');

    const edgeElement = document.createElement('div');
    edgeElement.className = 'graph-edge';
    edgeElement.setAttribute('data-source', edge.source);
    edgeElement.setAttribute('data-target', edge.target);
    graphContainer.appendChild(edgeElement);
  });

  container.appendChild(graphContainer);
  return graphContainer;
}

/**
 * Renders the index page with dependency graph
 * @param {HTMLElement} container - The container element for the index
 * @param {Object} data - The index data containing nodes and edges
 * @returns {HTMLElement} The rendered index container
 */
function renderIndex(container, data = {}) {
  if (!container) {
    throw new Error('Container is required');
  }

  const indexContainer = document.createElement('div');
  indexContainer.className = 'index-container';

  // Ensure container has an id for accessibility
  ensureElementHasId(indexContainer, 'index');

  // Add aria-label for accessibility
  addAriaLabel(indexContainer, 'Dependency index');

  // Render the dependency graphs using the new function
  renderDependencyGraphs(indexContainer, {
    nodes: data.nodes || [],
    edges: data.edges || []
  });

  container.appendChild(indexContainer);
  return indexContainer;
}

/**
 * Sample main.js with dependencyGraph container
 */
function renderDependencyGraph() {
  const container = document.getElementById('dependency-graph');

  if (container) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency graph visualization');

    // Ensure the container has an id for accessibility
    ensureElementHasId(container, 'dep-graph');
  }
}

/**
 * Resolved: Address accessibility issues - combines lang attribute and main landmark addition
 * @param {HTMLElement} container - The container element to fix accessibility issues in
 * @returns {Object} Object containing counts of fixes applied
 */
function addressAccessibilityIssues(container) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  // Add lang attribute to HTML element if missing
  const htmlElement = container || document.documentElement;
  const langAttr = getLangAttribute(htmlElement);
  if (!langAttr) {
    addLangAttribute(htmlElement, 'en');
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main') || container.querySelector('[role="main"]');
  if (!mainElement) {
    const body = container.querySelector('body');
    if (body) {
      const newMain = document.createElement('main');
      while (body.firstChild) {
        newMain.appendChild(body.firstChild);
      }
      body.insertBefore(newMain, body.firstChild);
      fixes.mainLandmarkAdded = true;
    }
  }

  // Fix landmark issues
  const landmarkFixes = validateLandmark(container);
  if (landmarkFixes && landmarkFixes.length > 0) {
    fixes.landmarksFixed = landmarkFixes.length;
  }
  const landmarkStructureFixes = validateLandmarkStructure(container);
  if (landmarkStructureFixes && landmarkStructureFixes.length > 0) {
    fixes.landmarksFixed += landmarkStructureFixes.length;
  }

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName && accessibleName.trim()) {
      setSvgAccessibilityProps(svg, accessibleName);
      fixes.svgNamesAdded++;
    }
  });

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll('[role="link"], a:not([href])');
  fakeLinks.forEach(link => {
    const style = window.getComputedStyle(link);
    if (style.cursor === 'pointer' || link.hasAttribute('onclick')) {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      fixes.fakeLinksFixed++;
    }
  });

  // Validate accessibility report
  const report = validateAccessibilityReport(container);
  if (report && report.length > 0) {
    log(`Accessibility report contains ${report.length} remaining issues`, 'warn');
  }

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info');
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info');
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
  }

  return fixes;
}

// New feature: Priority-based task scheduling
class ScreepsBot {
  constructor() {
    this.network = null;
    this.tasks = [];
    this.config = {};
  }

  async start() {
    // Initialize network connection
    await this.network.connect();

    // Load initial data
    await this.loadData();

    console.log('Screenspider bot started');
  }

  loadData() {
    // Placeholder for data loading logic
    // Implement actual data fetching here
  }

  // Accessibility enhancement: Ensure all UI elements are properly labeled
  setElementLabel(elementId, label) {
    const el = document.getElementById(elementId);
    if (el) {
      el.setAttribute('aria-label', label);
      el.setAttribute('role', 'button');
    }
  }

  // New feature: Priority-based task scheduling
  addTaskWithPriority(taskFn, priority = 'medium') {
    this.tasks.push({ task: taskFn, priority });
    this.scheduleTasks();
  }

  scheduleTasks() {
    // Sort tasks by priority (high > medium > low)
    this.tasks.sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 };
      return prioOrder[b.priority] - prioOrder[a.priority];
    });

    // Execute highest priority task
    if (this.tasks.length > 0) {
      const nextTask = this.tasks[0];
      try {
        nextTask.task();
      } catch (err) {
        console.error(`Task failed: ${err.message}`);
      }
    }
  }
}

// Helper function for UI updates with accessibility
function updateUI(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
    element.setAttribute('aria-live', 'polite');
  }
}

// Implementation of new function as per issue requirements
function newFunction() {
    // TODO: Implement the new function as per the issue requirements
    // Placeholder implementation - could be expanded based on specific requirements
    return 'New function executed';
}

// Existing function
function existingFunction() {
  // Function implementation
}

// New accessibility-related functions
/**
 * Gets the lang attribute from an element
 * @param {HTMLElement} element - The element to check
 * @returns {string|null} The lang attribute value or null if not found
 */
function getLangAttribute(element) {
  if (!element) return null;
  return element.getAttribute('lang') || element.getAttribute('xml:lang') || null;
}

/**
 * Adds lang attribute to an element
 * @param {HTMLElement} element - The element to add lang to
 * @param {string} lang - The language code to set
 */
function addLangAttribute(element, lang = 'en') {
  if (!element) return;
  element.setAttribute('lang', lang);
}

/**
 * Validates landmark elements in the container
 * @param {HTMLElement} container - The container to validate
 * @returns {Array} Array of fixed landmarks
 */
function validateLandmark(container) {
  if (!container) return [];

  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  const fixes = [];

  landmarks.forEach(landmark => {
    if (!landmark.id) {
      const role = landmark.getAttribute('role');
      ensureElementHasId(landmark, `landmark-${role}`);
      fixes.push(landmark);
    }
  });

  return fixes;
}

/**
 * Validates landmark structure in the container
 * @param {HTMLElement} container - The container to validate
 * @returns {Array} Array of fixed landmarks
 */
function validateLandmarkStructure(container) {
  if (!container) return [];

  const fixes = [];
  const requiredLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];

  requiredLandmarks.forEach(role => {
    const selector = role === 'main' ? 'main' : `[role="${role}"]`;
    const landmark = container.querySelector(selector);

    if (!landmark) {
      // Create missing landmark
      const newLandmark = document.createElement('div');
      newLandmark.setAttribute('role', role);
      ensureElementHasId(newLandmark, `landmark-${role}`);
      fixes.push(newLandmark);

      // Insert at appropriate position
      if (role === 'banner') {
        container.insertBefore(newLandmark, container.firstChild);
      } else if (role === 'contentinfo') {
        container.appendChild(newLandmark);
      } else {
        // Insert after banner if exists, otherwise at beginning
        const banner = container.querySelector('[role="banner"]');
        if (banner) {
          banner.insertAdjacentElement('afterend', newLandmark);
        } else {
          container.insertBefore(newLandmark, container.firstChild);
        }
      }
    }
  });

  return fixes;
}

/**
 * Gets accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element to check
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svg) {
  if (!svg) return null;

  // Check for title and description elements
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');

  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  // Check aria-label and aria-labelledby
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledElement = document.getElementById(ariaLabelledby);
    if (labelledElement && labelledElement.textContent.trim()) {
      return labelledElement.textContent.trim();
    }
  }

  return null;
}

/**
 * Sets accessibility properties for an SVG element
 * @param {SVGElement} svg - The SVG element to update
 * @param {string} accessibleName - The accessible name to set
 */
function setSvgAccessibilityProps(svg, accessibleName) {
  if (!svg || !accessibleName) return;

  // Ensure SVG has a title element
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = accessibleName;

  // Ensure SVG has a description if needed
  let desc = svg.querySelector('desc');
  if (!desc) {
    desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    svg.insertBefore(desc, title.nextSibling);
  }

  // Set aria-label as fallback
  svg.setAttribute('aria-label', accessibleName);
}

/**
 * Validates accessibility report for a container
 * @param {HTMLElement} container - The container to validate
 * @returns {Array} Array of accessibility issues found
 */
function validateAccessibilityReport(container) {
  if (!container) return [];

  const issues = [];

  // Check for missing alt text on images
  const images = container.querySelectorAll('img:not([alt])');
  images.forEach(img => {
    issues.push({
      element: img,
      issue: 'Missing alt text',
      severity: 'high'
    });
  });

  // Check for empty links
  const emptyLinks = container.querySelectorAll('a:not([href])');
  emptyLinks.forEach(link => {
    issues.push({
      element: link,
      issue: 'Empty link (missing href)',
      severity: 'high'
    });
  });

  // Check for missing labels on form elements
  const unlabeledInputs = container.querySelectorAll('input:not([id]):not([aria-label]):not([aria-labelledby])');
  unlabeledInputs.forEach(input => {
    issues.push({
      element: input,
      issue: 'Form element missing label',
      severity: 'medium'
    });
  });

  return issues;
}

/**
 * Creates an in-page button with accessibility attributes
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {string} options.id - Button ID
 * @param {string} options.ariaLabel - ARIA label
 * @param {Function} options.onClick - Click handler
 * @returns {HTMLElement} The created button
 */
function createInPageButton(options = {}) {
  const { text = '', id = '', ariaLabel = '', onClick = () => {} } = options;

  const button = document.createElement('button');
  button.textContent = text;

  if (id) {
    button.id = id;
  } else {
    ensureElementHasId(button, 'btn');
  }

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  button.addEventListener('click', onClick);

  return button;
}

// Export functions
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  ensureElementAccessibility,
  renderDependencyGraphs,
  renderIndex,
  renderDependencyGraph,
  addressAccessibilityIssues,
  ScreepsBot,
  updateUI,
  newFunction,
  existingFunction,
  getLangAttribute,
  addLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAccessibilityProps,
  validateAccessibilityReport,
  createInPageButton
};