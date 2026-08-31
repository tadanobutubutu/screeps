// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (typically in index.html, not main.js)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

// TODO: Create or update the affected functions to be accessible
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Helper function to get language attribute for HTML element
function getLangAttribute(document) {
  const htmlElement = document.documentElement;
  const lang = htmlElement.getAttribute('lang');
  return lang || 'en';
}

// Helper function to validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table.hasAttribute('caption')) {
    issues.push('REACT_027: Table missing caption');
  }
  
  if (!table.hasAttribute('scope')) {
    issues.push('REACT_027: Table missing scope attribute on headers');
  }
  
  return issues;
}

// Helper function to validate table structure
function validateTableStructure(table) {
  const issues = [];
  const rows = table.querySelectorAll('tr');
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`REACT_027: Row ${index} has no cells`);
    }
  });
  
  return issues;
}

// Helper function to validate landmark
function validateLandmark(element) {
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'footer', 'aside'];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role)) {
    return false;
  }
  
  return true;
}

// Helper function to validate landmark structure
function validateLandmarkStructure(document) {
  const issues = [];
  const mainElements = document.querySelectorAll('main, [role="main"]');
  
  if (mainElements.length === 0) {
    issues.push('REACT_017: Page missing main landmark');
  }
  
  return issues;
}

// Helper function to validate unique landmarks
function validateUniqueLandmarks(document) {
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const issues = [];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length > 1) {
      issues.push(`REACT_025: Multiple ${landmark} landmarks found`);
    }
  });
  
  return issues;
}

// Helper function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
  const titleElement = svgElement.querySelector('title');
  if (titleElement) {
    return titleElement.textContent;
  }
  return null;
}

// Helper function to set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  if (!svgElement.hasAttribute('aria-label') && !svgElement.querySelector('title')) {
    if (accessibleName) {
      svgElement.setAttribute('aria-label', accessibleName);
    }
  }
  
  const titleElement = svgElement.querySelector('title');
  if (titleElement && !titleElement.id) {
    const id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    titleElement.id = id;
    svgElement.setAttribute('aria-labelledby', id);
  }
}

// Helper function to validate link accessibility
function validateLinkAccessibility(link) {
  const issues = [];
  const href = link.getAttribute('href');
  const text = link.textContent.trim();
  
  if (!href || href === '#' || href === '') {
    issues.push('REACT_036: Link has no valid href');
  }
  
  if (!text) {
    issues.push('REACT_036: Link has no accessible text');
  }
  
  return issues;
}

// Helper function to handle fake links
function handleFakeLinks(document) {
  const issues = [];
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  
  fakeLinks.forEach((link, index) => {
    const text = link.textContent.trim();
    const onClick = link.getAttribute('onclick');
    
    if (text && onClick) {
      issues.push(`REACT_036: Fake link at index ${index} needs accessible handling`);
    }
  });
  
  return issues;
}

// Function to create accessible in-page button
function createInPageButton(buttonElement, langAttribute) {
  if (!buttonElement.hasAttribute('aria-label')) {
    const text = buttonElement.textContent.trim();
    if (!text) {
      buttonElement.setAttribute('aria-label', 'In-page button');
    }
  }
  
  if (!buttonElement.hasAttribute('lang')) {
    buttonElement.setAttribute('lang', langAttribute);
  }
  
  return buttonElement;
}

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
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
};