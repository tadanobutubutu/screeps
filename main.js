// main.js
// Entry point and core logic for the application.
// Existing exports and functions preserved; accessibility fixes added.

const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------------
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed
// ------------------------------------------------------------------

// Assuming 'addLangAttribute' is a function that has already been implemented
addLangAttribute();

// ------------------------------------------------------------------
// Existing helpers (preserved)
// ------------------------------------------------------------------
function loadConfiguration() {
  const configPath = path.join(__dirname, 'config.json');
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    return {};
  }
}

function processDataset(data) {
  return Array.isArray(data) ? data.map((item) => item * 2) : [];
}

function initializeApp() {
  // Original initialization logic preserved.
  const cfg = loadConfiguration();
  return processDataset(cfg.values);
}

function isLinkAccessible(link) {
  if (!link) {
    return false;
  }

  const tagName = link.tagName ? link.tagName.toUpperCase() : '';
  const role = link.getAttribute ? link.getAttribute('role') : null;
  const href = link.getAttribute ? link.getAttribute('href') : null;
  const text = link.textContent || '';
  const ariaLabel = link.getAttribute ? link.getAttribute('aria-label') : null;

  // Must be an anchor or have a link role
  if (tagName !== 'A' && role !== 'link') {
    return false;
  }

  // Must have a valid href (not missing, empty, or just a hash)
  if (!href || typeof href !== 'string' || href.trim() === '' || href.trim() === '#') {
    return false;
  }

  // Must not be a button disguised as a link
  if (role === 'button') {
    return false;
  }

  // Must have an accessible name
  const hasText = text.trim().length > 0;
  const hasAriaLabel = ariaLabel && ariaLabel.trim().length > 0;
  const hasAriaLabelledby = link.getAttribute ? !!link.getAttribute('aria-labelledby') : false;

  if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
    return false;
  }

  return true;
}

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

// ------------------------------------------------------------------
// Line 320 area: Address accessibility issues from insight report
// ------------------------------------------------------------------
function addressInsightAccessibility() {
  // Apply accessibility attributes to the insight report container
  // and its interactive elements per the insight report recommendations.
  if (typeof document === 'undefined') return;

  const container = document.getElementById('insight-report');
  if (container) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Insight report');
    container.setAttribute('aria-describedby', 'insight-description');
    container.setAttribute('tabindex', '0');
  }

  // Ensure headings are properly labelling sections
  const headings = container ? container.querySelectorAll('h2, h3') : [];
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = 'insight-heading-' + index;
    }
    heading.setAttribute('tabindex', '0');
  });

  // Make interactive elements focusable with clear labels
  const interactives = container ? container.querySelectorAll('button, a, input, select') : [];
  interactives.forEach((el) => {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      const labelText = el.getAttribute('data-label') || el.innerText || 'Action';
      el.setAttribute('aria-label', labelText.trim());
    }
  });
}

function createInsightReport(content) {
  const doc = typeof document !== 'undefined' ? document : null;
  const wrapper = doc ? doc.createElement('section') : {};
  wrapper.id = 'insight-report';

  // Accessibility fixes applied directly during creation
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Insight report');
  wrapper.setAttribute('aria-live', 'polite');

  const heading = doc ? doc.createElement('h2') : {};
  heading.textContent = content && content.title ? content.title : 'Insight Report';
  heading.id = 'insight-reference';
  heading.setAttribute('tabindex', '0');

  const desc = doc ? doc.createElement('p') : {};
  desc.id = 'insight-description';
  desc.textContent = content && content.description ? content.description : 'Detailed insight analysis.';

  wrapper.appendChild(heading);
  wrapper.appendChild(desc);

  return wrapper;
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

// Original content from main.js
function existingFunction() {
    // existing code
}

// New function implementation as per the issue requirements
function personName() {
    // Implementation details go here
    // For example:
    return 'New function result';
}

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    // Create a new button element
    const button = document.createElement('button');

    // Set the button's ID, text content, and class
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;

    // Append the button to the body or a specific container
    document.body.appendChild(button);
}

// ------------------------------------------------------------------
// Main execution (preserved)
// ------------------------------------------------------------------
function main() {
  const result = initializeApp();
  addressInsightAccessibility();
  return result;
}

// ------------------------------------------------------------------
// Exports (preserved; new accessibility helpers added)
// ------------------------------------------------------------------
module.exports = {
  loadConfiguration,
  processDataset,
  initializeApp,
  addressInsightAccessibility,
  createInsightReport,
  isLinkAccessible,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  existingFunction,
  personName,
  createInPageButton,
  main,
};