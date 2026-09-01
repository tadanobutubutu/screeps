// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues (_Add this function in a new section, as it requires DOM access and should not be exported for testing_)
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (_Add this function in a new section, as it requires DOM access and should not be exported for testing_)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)

/**
 * Ensures the given element has an ID.
 * If the element doesn't have an ID, generates a unique one.
 * @param {HTMLElement} element - The element to ensure has an ID
 * @returns {string} The element's ID (existing or newly generated)
 */
export function ensureElementHasId(element) {
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
export function addAriaLabel(element, label) {
  if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

/**
 * Renders a dependency graph visualization.
 * @param {Object} graphData - The dependency graph data
 * @param {HTMLElement} container - The container element to render into
 * @returns {HTMLElement} The container element
 */
export function renderDependencyGraph(graphData, container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  // Clear existing content
  container.innerHTML = '';

  // ... (existing renderDependencyGraph code)
}

// _REACT_017: Add landmark roles and fix landmark issues_
function ensureDistinctLandmarkClasses(container) {
  // Add landmark roles and ensure proper landmark regions
  // (Implement this function, using querySelectorAll and add appropriate roles)
}

// REACT_041: Add accessible names to SVGs
export function setSvgAccessibleNames(container) {
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

// REACT_025: Ensure unique landmarks
export function ensureUniqueLandmarkIds(container) {
  const landmarkIds = {}

  const landmarkElements = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');

  landmarkElements.forEach(el => {
    const role = el.getAttribute('role');
    const id = el.getAttribute('id');

    // If multiple of same landmark type and no id, generate a unique one
    if (landmarkIds[role] && !id) {
      landmarkIds[role].push(el);
      el.id = `unique-landmark-${role}-${landmarkIds[role].length}`;
    }

    // Store single instances for easy lookup later
    if (!landmarkIds[role]) {
      landmarkIds[role] = [el];
    } else {
      landmarkIds[role] = [...landmarkIds[role], el];
    }
  });
}

// REACT_036: Fix fake link issues
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
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  ensureLangAttribute
};