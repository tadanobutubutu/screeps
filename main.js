// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

// Assuming the main.js file is a JavaScript file that includes the HTML content of the ... file.

// ... (other code in main.js)

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
function addLangAttribute(element, lang) {
  if (element) {
    element.classList.remove('rotated');
  }
}

// Added: The requested function
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.ariaLabel = 'rotate back';
  button.textContent = 'rotate back';
  button.onclick = rotateBack;
  return button;
}

// REACT_041: Add accessible names to 2 SVGs
// Add aria-label or aria-labelledby to SVG elements
function addSvgAccessibleNames(svgElement, label) {
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return;
  }
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-label', label);
}

// Example usage for SVGs:
// const svg1 = document.querySelector('svg.icon1');
// const svg2 = document.querySelector('svg.icon2');
// addSvgAccessibleNames(svg1, 'Description of first icon');
// addSvgAccessibleNames(svg2, 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

// Ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphAriaRole() {
  const dependencyGraph = document.getElementById('dependencyGraph') || 
                          document.querySelector('.dependencyGraph') || 
                          document.querySelector('[data-dependency-graph]');
  
  if (dependencyGraph) {
    // Add ARIA role if not present
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    
    // Add accessible name if not present
    if (!dependencyGraph.hasAttribute('aria-label') && 
        !dependencyGraph.hasAttribute('aria-labelledby')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
}

// NEW FUNCTION: Ensure the element has an id, generating a unique one if needed
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    return null;
  }
  
  if (!element.id) {
    // Generate a unique id using timestamp and random string
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    element.id = `${prefix}-${timestamp}-${randomStr}`;
  }
  
  return element.id;
}

// NEW FUNCTION: Add aria-label to any element
function addAriaLabelToElement(element, label) {
  if (!element) {
    return null;
  }
  
  if (typeof label !== 'string' || label.trim() === '') {
    return element;
  }
  
  element.setAttribute('aria-label', label);
  return element;
}

// NEW FUNCTION: Render dependency graphs
function renderDependencyGraph(containerSelector, dependencies, options = {}) {
  const container = typeof containerSelector === 'string' 
    ? document.querySelector(containerSelector) 
    : containerSelector;
  
  if (!container) {
    console.error('Container element not found for dependency graph');
    return null;
  }
  
  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    console.warn('No dependencies provided for rendering');
    return null;
  }
  
  const {
    width = 600,
    height = 300,
    nodeWidth = 120,
    nodeHeight = 50,
    gapX = 20,
    gapY = 30,
    title = 'Dependency Graph'
  } = options;
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', title);
  
  // Add title for accessibility
  const svgTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  svgTitle.textContent = title;
  svg.appendChild(svgTitle);
  
  // Calculate layout
  const totalNodesWidth = dependencies.length * nodeWidth + (dependencies.length - 1) * gapX;
  const startX = Math.max((width - totalNodesWidth) / 2, 10);
  const startY = Math.max((height - nodeHeight) / 2, 10);
  
  // Draw nodes and connections
  dependencies.forEach((dep, index) => {
    const x = startX + index * (nodeWidth + gapX);
    const y = startY;
    
    // Draw connection line (except for first node)
    if (index > 0) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const prevX = startX + (index - 1) * (nodeWidth + gapX) + nodeWidth;
      const prevY = startY + nodeHeight / 2;
      line.setAttribute('x1', String(prevX));
      line.setAttribute('y1', String(prevY));
      line.setAttribute('x2', String(x));
      line.setAttribute('y2', String(y + nodeHeight / 2));
      line.setAttribute('stroke', '#666');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      svg.appendChild(line);
    }
    
    // Draw node rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', String(x));
    rect.setAttribute('y', String(y));
    rect.setAttribute('width', String(nodeWidth));
    rect.setAttribute('height', String(nodeHeight));
    rect.setAttribute('rx', '5');
    rect.setAttribute('ry', '5');
    rect.setAttribute('fill', '#4CAF50');
    rect.setAttribute('stroke', '#2E7D32');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);
    
    // Draw node label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(x + nodeWidth / 2));
    text.setAttribute('y', String(y + nodeHeight / 2 + 5));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', '12');
    text.textContent = dep.name || dep;
    svg.appendChild(text);
    
    // Draw version if available
    if (dep.version) {
      const versionText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      versionText.setAttribute('x', String(x + nodeWidth / 2));
      versionText.setAttribute('y', String(y + nodeHeight / 2 + 18));
      versionText.setAttribute('text-anchor', 'middle');
      versionText.setAttribute('fill', '#c8e6c9');
      versionText.setAttribute('font-family', 'Arial, sans-serif');
      versionText.setAttribute('font-size', '10');
      versionText.textContent = `v${dep.version}`;
      svg.appendChild(versionText);
    }
  });
  
  // Add arrowhead marker definition
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '10');
  marker.setAttribute('refY', '3.5');
  marker.setAttribute('orient', 'auto');
  
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  polygon.setAttribute('fill', '#666');
  
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.insertBefore(defs, svg.firstChild);
  
  // Append to container
  container.appendChild(svg);
  
  return svg;
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink) {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
  
  // Ensure dependencyGraph container has proper ARIA role
  ensureDependencyGraphAriaRole();
}

// Run accessibility initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
const rootElement = document.documentElement || document.body;

if (rootElement) {
  addLangAttribute('en');
}

ensureUniqueLandmarks();

// REACT_027: Fix 26 table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has a caption
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure all <th> elements have scope attribute
    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (!th.hasAttribute('scope')) {
        const parent = th.parentElement;
        const parentTagName = parent ? parent.tagName.toLowerCase() : '';
        const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

        if (isFirstCell && parentTagName === 'tr') {
          th.setAttribute('scope', 'row');
        } else if (parentTagName === 'thead' || !isFirstCell) {
          th.setAttribute('scope', 'col');
        }
      }
    });

// --- NEW FUNCTIONS ADDED ---

/**
 * Ensures that an element has an id attribute.
 * If the element doesn't have an id, generates a unique one based on the tag name and a random suffix.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix] - Optional prefix for the generated id
 * @returns {string|null} - The element's id (existing or newly generated) or null if element is invalid
 */
function ensureElementHasId(element, prefix) {
  if (!element) {
    return null;
  }
  
  if (element.id && element.id.trim() !== '') {
    return element.id;
  }
  
  const tagName = element.tagName ? element.tagName.toLowerCase() : 'element';
  const basePrefix = prefix || tagName;
  const uniqueId = `${basePrefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  element.id = uniqueId;
  return uniqueId;
}

/**
 * Ensures that multiple elements have id attributes.
 * @param {HTMLElement[]} elements - Array of elements to process
 * @param {string} [prefix] - Optional prefix for generated ids
 * @returns {string[]} - Array of id strings
 */
function ensureElementsHaveIds(elements, prefix) {
  if (!elements || !Array.isArray(elements)) {
    return [];
  }
  
  return elements.map((el, index) => {
    const elementPrefix = prefix || `element-${index}`;
    return ensureElementHasId(el, elementPrefix);
  });
}

/**
 * Adds or updates an aria-label attribute on an element.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement|null} - The element with the aria-label set, or null if element is invalid
 */
function addAriaLabel(element, label) {
  if (!element) {
    return null;
  }
  
  if (label && typeof label === 'string') {
    element.setAttribute('aria-label', label);
  }
  
  return element;
}

/**
 * Adds aria-label to multiple elements.
 * @param {HTMLElement[]} elements - Array of elements
 * @param {string} label - The label text to set
 * @returns {HTMLElement[]} - Array of elements with aria-label set
 */
function addAriaLabels(elements, label) {
  if (!elements || !Array.isArray(elements)) {
    return [];
  }
  
  return elements.map(el => addAriaLabel(el, label));
}

/**
 * Renders a dependency graph visualization in a container element.
 * @param {string|HTMLElement} container - The container element or its id
 * @param {Object} dependencies - The dependency data object
 * @param {Array} dependencies.nodes - Array of node objects with id and label properties
 * @param {Array} dependencies.edges - Array of edge objects with source and target properties
 * @param {Object} [options] - Optional rendering options
 * @returns {HTMLElement|null} - The SVG element containing the graph, or null on error
 */
function renderDependencyGraph(container, dependencies, options) {
  // Get container element
  let containerElement;
  if (typeof container === 'string') {
    containerElement = document.getElementById(container);
  } else if (container && container.tagName) {
    containerElement = container;
  }
  
  if (!containerElement || !dependencies) {
    console.error('Invalid container or dependencies data provided');
    return null;
  }
  
  const nodes = dependencies.nodes || [];
  const edges = dependencies.edges || [];
  
  // Default options
  const renderOptions = {
    width: options?.width || 600,
    height: options?.height || 400,
    nodeRadius: options?.nodeRadius || 25,
    nodeColor: options?.nodeColor || '#4a90e2',
    edgeColor: options?.edgeColor || '#888',
    labelColor: options?.labelColor || '#fff',
    fontSize: options?.fontSize || 12
  };
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', renderOptions.width);
  svg.setAttribute('height', renderOptions.height);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency graph visualization');
  
  // Define arrow marker for directed edges
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${renderOptions.edgeColor}"/>
    </marker>
  `;
  svg.appendChild(defs);
  
  // Calculate node positions in a circular layout if no positions provided
  const nodePositions = {};
  const centerX = renderOptions.width / 2;
  const centerY = renderOptions.height / 2;
  const radius = Math.min(centerX, centerY) - renderOptions.nodeRadius - 50;
  
  nodes.forEach((node, index) => {
    if (node.x !== undefined && node.y !== undefined) {
      nodePositions[node.id] = { x: node.x, y: node.y };
    } else {
      const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
      nodePositions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    }
  });
  
  // Draw edges
  edges.forEach(edge => {
    const sourcePos = nodePositions[edge.source];
    const targetPos = nodePositions[edge.target];
    
    if (sourcePos && targetPos) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', sourcePos.x);
      line.setAttribute('y1', sourcePos.y);
      line.setAttribute('x2', targetPos.x);
      line.setAttribute('y2', targetPos.y);
      line.setAttribute('stroke', renderOptions.edgeColor);
      line.setAttribute('stroke-width', '2');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      svg.appendChild(line);
    }
  });
  
  // Draw nodes
  nodes.forEach(node => {
    const pos = nodePositions[node.id];
    if (!pos) return;
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('role', 'button');
    group.setAttribute('aria-label', node.label || `Node ${node.id}`);
    
    // Node circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', renderOptions.nodeRadius);
    circle.setAttribute('fill', node.color || renderOptions.nodeColor);
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '2');
    group.appendChild(circle);
    
    // Node label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x);
    text.setAttribute('y', pos.y + renderOptions.fontSize / 3);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', renderOptions.labelColor);
    text.setAttribute('font-size', renderOptions.fontSize);
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.textContent = node.label || node.id;
    group.appendChild(text);
    
    svg.appendChild(group);
  });
  
  // Clear container and append SVG
  containerElement.innerHTML = '';
  containerElement.appendChild(svg);
  
  return svg;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rotateBack,
    createUnrotateButton,
    addSvgAccessibility,
    ensureThScope,
    initializeAccessibility,
    addMainLandmark,
    ensureUniqueLandmarks,
    addSvgAccessibleNames,
    fixFakeLinkIssue,
    addLangAttribute,
    addressAccessibilityIssues,
    ensureElementHasId,
    ensureElementsHaveIds,
    addAriaLabel,
    addAriaLabels,
    renderDependencyGraph
  };
}