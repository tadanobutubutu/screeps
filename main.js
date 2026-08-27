// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// Add lang attribute to HTML element
function addLangAttribute() {
  // Implementation of addLangAttribute
}

// Fix 26 table structure issues
function fixTableStructure() {
  // Implementation of fixTableStructure
}

// Add/fix 4 landmark issues
function addMainLandmark() {
  // Implementation of addMainLandmark
}

function validateLandmark() {
  // Implementation of validateLandmark
}

function validateUniqueLandmarks() {
  // Implementation of validateUniqueLandmarks
}

function validateLandmarkStructure() {
  // Implementation of validateLandmarkStructure
}

// Add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  // Implementation of addSvgAccessibleNames
}

function getSvgAccessibleName() {
  // Implementation of getSvgAccessibleName
}

function createSvgAccessibilityProps() {
  // Implementation of createSvgAccessibilityProps
}

// Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // Implementation of ensureUniqueLandmarks
}

// Fix 1 fake link issue
function fixFakeLinkIssue() {
  // Implementation of fixFakeLinkIssue
}

function validateLinkAccessibility() {
  // Implementation of validateLinkAccessibility
}

function createInPageButton() {
  // Implementation of createInPageButton
}

function validateLinkOrButton() {
  // Implementation of validateLinkOrButton
}

function createAccessibleLink() {
  // Implementation of createAccessibleLink
}

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from
// their respective modules for better maintainability and content separation.

// Import content from dedicated modules for better maintainability and
// content separation. These imports enable the renderDependencyGraph and
// renderIndexView functions below to use externally defined content rather
// than hardcoded strings.
import { dependencyGraphContent } from './dependencyGraphContent.js';
import { indexContent } from './indexContent.js';

/**
 * Renders a dependency graph using content sourced from the
 * dependencyGraphContent module. This centralizes the graph's textual
 * structure and configuration outside of main.js for easier maintenance.
 *
 * @param {HTMLElement|string} target - DOM element (or selector) to render
 *   the dependency graph into.
 * @returns {void}
 */
function renderDependencyGraph(target) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) {
    return;
  }

  const { title, description, nodes, edges } = dependencyGraphContent;

  // Build a minimal, accessible representation of the dependency graph
  // using the externally provided content.
  const wrapper = document.createElement('section');
  wrapper.className = 'dependency-graph';
  wrapper.setAttribute('aria-label', title);

  if (description) {
    const desc = document.createElement('p');
    desc.className = 'dependency-graph__description';
    desc.textContent = description;
    wrapper.appendChild(desc);
  }

  const list = document.createElement('ul');
  list.className = 'dependency-graph__nodes';

  (nodes || []).forEach((node) => {
    const li = document.createElement('li');
    li.className = 'dependency-graph__node';
    li.textContent = node.label || node.id;
    list.appendChild(li);
  });

  wrapper.appendChild(list);

  // Surface edge count for downstream tooling without altering DOM layout.
  if (Array.isArray(edges)) {
    wrapper.dataset.edgeCount = String(edges.length);
  }

  container.appendChild(wrapper);
}

/**
 * Renders the index view using content sourced from the indexContent
 * module. Keeps the index markup and copy in a dedicated content file
 * for separation of concerns.
 *
 * @param {HTMLElement|string} target - DOM element (or selector) to render
 *   the index view into.
 * @returns {void}
 */
function renderIndexView(target) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) {
    return;
  }

  const { heading, items } = indexContent;

  const section = document.createElement('section');
  section.className = 'index-view';

  if (heading) {
    const h = document.createElement('h2');
    h.className = 'index-view__heading';
    h.textContent = heading;
    section.appendChild(h);
  }

  const list = document.createElement('ul');
  list.className = 'index-view__items';

  (items || []).forEach((item) => {
    const li = document.createElement('li');
    li.className = 'index-view__item';

    if (item && item.href) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label || item.href;
      li.appendChild(a);
    } else if (item) {
      li.textContent = item.label || String(item);
    }

    list.appendChild(li);
  });

  section.appendChild(list);
  container.appendChild(section);
}

/**
 * Initializes the dependency graph and index view renderers by locating
 * their mount points in the DOM (if present) and rendering the content
 * imported from the dedicated modules.
 *
 * @returns {void}
 */
function initDependencyGraphAndIndexViews() {
  renderDependencyGraph('#dependency-graph');
  renderIndexView('#index-view');
}

// Existing exports and functions
// ... (Preserve all existing exports and functions)

// Example of an existing export
export function someExistingFunction() {
  // Existing function implementation
}

// New export if needed (if any of the new functions are meant to be exported)
export {
  renderDependencyGraph,
  renderIndexView,
  initDependencyGraphAndIndexViews,
};
// export function newExportedFunction() {
//   // New function implementation
// }