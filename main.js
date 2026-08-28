// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Ensures that the given element has an id attribute.
 * If the element doesn't have an id, generates and assigns a unique one.
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} [prefix='element'] - Optional prefix for the generated id
 * @returns {string} The element's id
 */
export function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!element.id) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    element.id = `${prefix}-${timestamp}-${randomStr}`;
  }
  
  return element.id;
}

/**
 * Adds an aria-label attribute to the given element.
 * @param {HTMLElement} element - The DOM element to modify
 * @param {string} label - The aria-label value to set
 * @returns {void}
 */
export function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (typeof label !== 'string' || label.trim() === '') {
    throw new Error('Label must be a non-empty string');
  }
  
  element.setAttribute('aria-label', label);
}

/**
 * Renders a dependency graph visualization in the specified container.
 * @param {HTMLElement|string} container - The container element or its id
 * @param {Array<{name: string, dependencies?: string[]}>} dependencies - Array of dependency nodes
 * @param {Object} [options] - Optional rendering options
 * @param {number} [options.width=800] - Width of the graph
 * @param {number} [options.height=400] - Height of the graph
 * @returns {SVGSVGElement} The rendered SVG element
 */
export function renderDependencyGraph(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container is required');
  }
  
  const containerElement = typeof container === 'string' 
    ? document.getElementById(container) 
    : container;
  
  if (!containerElement) {
    throw new Error('Container element not found');
  }
  
  if (!Array.isArray(dependencies)) {
    throw new Error('Dependencies must be an array');
  }
  
  const { width = 800, height = 400 } = options;
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency graph visualization');
  
  // Clear any existing content
  containerElement.innerHTML = '';
  
  if (dependencies.length === 0) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(width / 2));
    text.setAttribute('y', String(height / 2));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#666');
    text.textContent = 'No dependencies to display';
    svg.appendChild(text);
    containerElement.appendChild(svg);
    return svg;
  }
  
  const nodeRadius = 30;
  const horizontalSpacing = Math.min(120, (width - 100) / dependencies.length);
  const startX = (width - (dependencies.length - 1) * horizontalSpacing) / 2;
  const centerY = height / 2;
  
  // Draw connections first (so they appear behind nodes)
  dependencies.forEach((dep, index) => {
    const toX = startX + index * horizontalSpacing;
    
    if (dep.dependencies && Array.isArray(dep.dependencies)) {
      dep.dependencies.forEach(depName => {
        const depIndex = dependencies.findIndex(d => d.name === depName);
        if (depIndex !== -1 && depIndex < index) {
          const fromX = startX + depIndex * horizontalSpacing;
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', String(fromX));
          line.setAttribute('y1', String(centerY));
          line.setAttribute('x2', String(toX));
          line.setAttribute('y2', String(centerY));
          line.setAttribute('stroke', '#999');
          line.setAttribute('stroke-width', '2');
          line.setAttribute('marker-end', 'url(#arrowhead)');
          svg.appendChild(line);
        }
      });
    }
  });
  
  // Add arrowhead marker definition
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
  dependencies.forEach((dep, index) => {
    const x = startX + index * horizontalSpacing;
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('role', 'img');
    group.setAttribute('aria-label', `Dependency: ${dep.name}`);
    
    // Node circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(centerY));
    circle.setAttribute('r', String(nodeRadius));
    circle.setAttribute('fill', '#4A90E2');
    circle.setAttribute('stroke', '#2E5A8C');
    circle.setAttribute('stroke-width', '2');
    
    // Node label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(x));
    text.setAttribute('y', String(centerY + 5));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', '12');
    text.textContent = dep.name.length > 10 ? dep.name.substring(0, 8) + '...' : dep.name;
    
    // Tooltip title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = dep.name;
    
    group.appendChild(title);
    group.appendChild(circle);
    group.appendChild(text);
    svg.appendChild(group);
  });
  
  containerElement.appendChild(svg);
  return svg;
}

// Make functions available globally for non-module usage
if (typeof window !== 'undefined') {
  window.ensureElementHasId = ensureElementHasId;
  window.addAriaLabel = addAriaLabel;
  window.renderDependencyGraph = renderDependencyGraph;
}