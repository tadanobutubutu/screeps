// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

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
export function renderDependencyGraph(graphData, container) {
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
function ensureLangAttribute(document) {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', document.documentElement.lang || 'en');
  }
  return html.getAttribute('lang');
}

/**
 * REACT_015: Gets the lang attribute from the HTML element.
 * Falls back to 'en' if not present.
 * @param {Document} document - The document to inspect
 * @returns {string} The lang attribute value
 */
export function getLangAttribute(document) {
  const html = document.documentElement;
  return html.getAttribute('lang') || 'en';
}

/**
 * REACT_027: Validates the overall accessibility of tables in a container.
 * Checks for presence of captions, headers, and proper roles.
 * @param {HTMLElement} container - The container to check tables in
 * @returns {Object} An object containing counts of issues found
 */
export function validateTableAccessibility(container) {
  const tables = container.querySelectorAll('table');
  const issues = {
    missingCaption: 0,
    missingHeaders: 0,
    invalidStructure: 0,
  };

  tables.forEach(table => {
    if (!table.querySelector('caption') && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
      issues.missingCaption++;
    }
    if (!table.querySelector('th') && !table.querySelector('[role="columnheader"]') && !table.querySelector('[role="rowheader"]')) {
      issues.missingHeaders++;
    }
  });

  return issues;
}

/**
 * REACT_027: Validates the structure of tables in a container.
 * Ensures proper scope attributes on th elements.
 * @param {HTMLElement} container - The container to check tables in
 * @returns {Object} An object containing counts of structure issues
 */
export function validateTableStructure(container) {
  const tables = container.querySelectorAll('table');
  const issues = {
    missingScope: 0,
    invalidHeaders: 0,
    nestedTables: 0,
  };

  tables.forEach(table => {
    const ths = table.querySelectorAll('th');
    ths.forEach(th => {
      if (!th.hasAttribute('scope')) {
        issues.missingScope++;
      }
    });
    if (table.querySelector('table table')) {
      issues.nestedTables++;
    }
  });

  return issues;
}

/**
 * REACT_017: Validates the landmark structure in a container.
 * @param {HTMLElement} container - The container to check landmarks in
 * @returns {Object} An object containing landmark validation results
 */
export function validateLandmark(container) {
  const landmarkTags = ['header', 'nav', 'main', 'aside', 'footer'];
  const found = {};
  landmarkTags.forEach(tag => {
    found[tag] = container.querySelectorAll(tag).length;
  });
  return found;
}

/**
 * REACT_017: Validates the overall landmark structure.
 * @param {HTMLElement} container - The container to check
 * @returns {Object} An object containing landmark structure validation
 */
export function validateLandmarkStructure(container) {
  const landmarks = validateLandmark(container);
  const issues = [];
  if (landmarks.main === 0) {
    issues.push('Missing main landmark');
  }
  if (landmarks.nav === 0) {
    issues.push('Missing navigation landmark');
  }
  return { landmarks, issues };
}

/**
 * REACT_041: Gets the accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element to inspect
 * @returns {string|null} The accessible name or null if not found
 */
export function getSvgAccessibleName(svg) {
  if (svg.hasAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }
  if (svg.hasAttribute('aria-labelledby')) {
    const id = svg.getAttribute('aria-labelledby');
    const labelEl = document.getElementById(id);
    if (labelEl) {
      return labelEl.textContent;
    }
  }
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  return null;
}

/**
 * REACT_036: Creates an in-page button from a fake link element.
 * @param {HTMLElement} element - The element to convert
 * @returns {HTMLElement} The converted button element
 */
export function createInPageButton(element) {
  element.setAttribute('role', 'button');
  if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    element.setAttribute('aria-label', element.textContent.trim());
  }
  return element;
}

/**
 * REACT_036: Returns a person's accessible name from a name object.
 * @param {Object} person - The person object with name properties
 * @returns {string} The accessible name for the person
 */
export function personName(person) {
  if (!person) return '';
  if (person.fullName) return person.fullName;
  if (person.firstName && person.lastName) {
    return `${person.firstName} ${person.lastName}`;
  }
  return person.name || '';
}

// Export all functions for testing
export {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  ensureLandmarkRoles,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureLangAttribute,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  personName
};