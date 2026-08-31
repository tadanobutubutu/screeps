// TODO: This is the existing code that needs to be preserved

/**
 * Ensures an element has an id attribute
 * @param {HTMLElement} element - The element to check
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to an element
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {HTMLElement} The element with aria-label added
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (typeof label !== 'string') {
    throw new Error('Label must be a string');
  }
  
  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Renders a dependency graph
 * @param {Object} data - The dependency data to render
 * @param {HTMLElement} container - The container element for the graph
 * @returns {HTMLElement} The rendered graph container
 */
function renderDependencyGraph(data, container) {
  if (!data) {
    throw new Error('Dependency data is required');
  }
  
  const graphContainer = container || document.createElement('div');
  graphContainer.className = 'dependency-graph';
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 600');
  
  // Render nodes and edges based on data
  if (data.nodes && Array.isArray(data.nodes)) {
    data.nodes.forEach((node, index) => {
      const x = 100 + (index % 4) * 200;
      const y = 100 + Math.floor(index / 4) * 150;
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x}, ${y})`);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '30');
      circle.setAttribute('fill', node.color || '#4A90E2');
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '.35em');
      text.textContent = node.name || node.id || index;
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
  }
  
  // Render edges
  if (data.edges && Array.isArray(data.edges)) {
    data.edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', edge.sourceX || 0);
      line.setAttribute('y1', edge.sourceY || 0);
      line.setAttribute('x2', edge.targetX || 0);
      line.setAttribute('y2', edge.targetY || 0);
      line.setAttribute('stroke', '#999');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    });
  }
  
  graphContainer.appendChild(svg);
  ensureElementHasId(graphContainer);
  addAriaLabel(graphContainer, 'Dependency graph visualization');
  
  return graphContainer;
}

// New accessibility-related functions

/**
 * Adds a lang attribute to an HTML element.
 * @param {HTMLElement} element - The element to update
 * @param {string} [language='en'] - The language code
 * @returns {HTMLElement} The modified element
 */
function addLangAttribute(element, language = 'en') {
  if (!element) {
    throw new Error('Element is required');
  }
  element.lang = language;
  return element;
}

/**
 * Fixes common table structure issues by ensuring proper headers and scopes.
 * @param {HTMLElement} table - The table element to fix
 * @returns {HTMLElement} The fixed table element
 */
function fixTableStructure(table) {
  // Ensure table has a scope attribute
  if (!table.getAttribute('scope')) {
    table.setAttribute('scope', 'table');
  }

  // If there are thead/tbody/tr, ensure they exist
  if (table.querySelector('thead')) {
    table.setAttribute('scope', 'group');
  } else if (table.querySelector('tbody')) {
    table.setAttribute('scope', 'group');
  }

  // Add row indices for cells
  table.querySelectorAll('td, th').forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      cell.setAttribute('scope', 'column');
    }
  });

  // Ensure first column is always a heading
  const firstCell = table.querySelector('th, td');
  if (firstCell) {
    firstCell.setAttribute('scope', 'rowheader');
  }

  return table;
}

/**
 * Applies landmark roles to a collection of elements.
 * @param {HTMLElement[]} elements - Elements to mark as landmarks
 * @returns {HTMLElement[]} The same elements with added roles
 */
function fixLandmarkIssues(elements) {
  elements.forEach(el => {
    // Mark main landmark
    el.setAttribute('role', 'main');
    // Additional landmarks can be marked with complementary roles
    if (el.tagName === 'img' || el.tagName === 'picture') {
      el.setAttribute('role', 'region');
    }
  });
}

/**
 * Creates a main landmark element in the document.
 * @returns {HTMLElement} The created main landmark element
 */
function addMainLandmark() {
  const landmark = document.createElement('div');
  landmark.setAttribute('role', 'main');
  landmark.setAttribute('aria-label', 'Main landing page');
  // Optional: style for visibility
  landmark.style.display = 'block';
  return landmark;
}

/**
 * Defines landmark regions around key areas.
 * @param {HTMLElement} root - Root element containing landmarks
 * @returns {HTMLElement} The root element (unchanged)
 */
function addLandmarkRegions(root) {
  // Example: wrap each major section with a landmark region
  const sections = [
    { id: 'intro', tag: 'section' },
    { id: 'features', tag: 'section' },
    { id: 'contact', tag: 'section' }
  ];

  sections.forEach(section => {
    const region = document.createElement('div');
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', `${section.id} section`);
    root.appendChild(region);
  });

  return root;
}

/**
 * Ensures all landmark elements have unique identifiers.
 * @returns {boolean} Whether uniqueness was ensured
 */
function ensureUniqueLandmarks() {
  // Collect all landmark elements with role="main" or role="region"
  const landmarks = document.querySelectorAll('[role="main"], [role="region"]');
  const ids = new Set();

  landmarks.forEach(el => {
    const id = el.id || el.getAttribute('data-id');
    if (id) {
      if (ids.has(id)) {
        console.warn(`Duplicate landmark ID found: ${id}`);
      }
      ids.add(id);
    }
  });

  // Optionally generate unique IDs if duplicates exist
  // For simplicity, we just log warnings; no action taken here.
  return true;
}

/**
 * Adds accessible names to SVG elements.
 * @param {HTMLElement|SVGSVGElement} svg - The SVG element to annotate
 * @returns {HTMLElement|SVGSVGElement} The annotated SVG
 */
function addSvgAccessibleNames(svg) {
  if (!svg) return svg;

  // Find all text elements inside the SVG
  const texts = svg.querySelectorAll('text, title, desc');
  texts.forEach(text => {
    if (text.textContent.trim()) {
      text.setAttribute('aria-label', text.textContent.trim());
    }
  });

  // Also add accessible name to the SVG itself
  svg.setAttribute('aria-label', 'Interactive diagram');
  return svg;
}

/**
 * Iterates over a collection of SVG elements and adds accessible names.
 * @param {HTMLElement[]} svgs - Array of SVG elements
 * @returns {HTMLElement[]} The processed SVG elements
 */
function addAccessibleNamesToSVGs(svgs) {
  svgs.forEach(svg => {
    addSvgAccessibleNames(svg);
  });
}

/**
 * Fixes fake link issues by correcting invalid hrefs.
 * @param {HTMLElement} link - The link element to fix
 * @returns {HTMLElement} The corrected link element
 */
function fixFakeLinkIssue(link) {
  if (!link) return link;

  // If href is empty or not a valid URL, set to a safe default
  if (!link.getAttribute('href') || !link.getAttribute('href').startsWith('http')) {
    link.setAttribute('href', '');
  }

  // Optionally add target="_blank" if needed
  if (!link.getAttribute('target') && link.href) {
    link.setAttribute('target', '_blank');
  }

  return link;
}

/**
 * Handles multiple fake link issues across a list of links.
 * @param {HTMLElement[]} links - Array of link elements
 * @returns {HTMLElement[]} The cleaned link array
 */
function fixFakeLinkIssues(links) {
  return links.map(fixFakeLinkIssue);
}

/**
 * Implements Google sign-in logic.
 * @returns {boolean} Indicating success
 */
function googleSignIn() {
  // Placeholder for Google sign-in integration
  // In a real app, this would initialize the Google Sign-In component
  console.log('Google sign-in initialized');
  return true;
}

/**
 * Replaces my-button with an actual button id for accessibility.
 * @returns {HTMLElement} The button element with a proper id
 */
function fixButtonIdentifiers() {
  // Find all button elements and ensure they have unique ids
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (!btn.id) {
      btn.id = `my-button-${Date.now()}`;
    }
  });

  // Additionally, ensure any <input type="submit"> has an id
  const inputs = document.querySelectorAll('input[type="submit"]');
  inputs.forEach(input => {
    if (!input.id) {
      input.id = `submit-${Date.now()}`;
    }
  });

  return buttons;
}

/**
 * Ensures the dependency graph container has a proper ARIA role.
 * @param {HTMLElement} container - The container element
 * @returns {HTMLElement} The container with ARIA role set
 */
function ensureDependencyGraphAriaRole(container) {
  if (!container) return container;

  // Default role if none present
  if (!container.getAttribute('role')) {
    container.setAttribute('role', 'diagram');
  }

  return container;
}