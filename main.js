// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Ensures the element has an id. If the element doesn't have an id, generates one.
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Optional prefix for the generated id
 * @returns {string} The id of the element
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
 * Adds an aria-label to the element if it doesn't already have one
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {void}
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Renders dependency graphs
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} dependencies - The dependency data to render
 * @returns {void}
 */
function renderDependencyGraphs(container, dependencies) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  if (!dependencies || typeof dependencies !== 'object') {
    throw new Error('Valid dependencies object is required');
  }
  
  // Clear the container
  container.innerHTML = '';
  
  // Create SVG for the graph
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '400');
  svg.setAttribute('viewBox', '0 0 800 400');
  
  // Create a group for the nodes
  const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodeGroup.setAttribute('class', 'nodes');
  
  // Render each dependency node
  let yOffset = 50;
  Object.entries(dependencies).forEach(([name, deps], index) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Node rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '50');
    rect.setAttribute('y', String(yOffset));
    rect.setAttribute('width', '150');
    rect.setAttribute('height', '40');
    rect.setAttribute('rx', '5');
    rect.setAttribute('fill', '#4a90e2');
    rect.setAttribute('stroke', '#333');
    rect.setAttribute('stroke-width', '2');
    
    // Node text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '125');
    text.setAttribute('y', String(yOffset + 25));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', '14');
    text.textContent = name;
    
    node.appendChild(rect);
    node.appendChild(text);
    
    // Draw connections to dependencies
    if (Array.isArray(deps)) {
      let depX = 220;
      deps.forEach((dep, depIndex) => {
        const depNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        const depRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        depRect.setAttribute('x', String(depX));
        depRect.setAttribute('y', String(yOffset));
        depRect.setAttribute('width', '100');
        depRect.setAttribute('height', '40');
        depRect.setAttribute('rx', '5');
        depRect.setAttribute('fill', '#50c878');
        depRect.setAttribute('stroke', '#333');
        depRect.setAttribute('stroke-width', '2');
        
        const depText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        depText.setAttribute('x', String(depX + 50));
        depText.setAttribute('y', String(yOffset + 25));
        depText.setAttribute('text-anchor', 'middle');
        depText.setAttribute('fill', 'white');
        depText.setAttribute('font-family', 'Arial, sans-serif');
        depText.setAttribute('font-size', '12');
        depText.textContent = dep;
        
        // Draw line connecting nodes
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '200');
        line.setAttribute('y1', String(yOffset + 20));
        line.setAttribute('x2', String(depX));
        line.setAttribute('y2', String(yOffset + 20));
        line.setAttribute('stroke', '#666');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        
        depNode.appendChild(line);
        depNode.appendChild(depRect);
        depNode.appendChild(depText);
        
        nodeGroup.appendChild(depNode);
        depX += 130;
      });
    }
    
    nodeGroup.appendChild(node);
    yOffset += 60;
  });
  
  // Define arrow marker
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
  polygon.setAttribute('fill', '#666');
  
  marker.appendChild(polygon);
  defs.appendChild(marker);
  
  svg.appendChild(defs);
  svg.appendChild(nodeGroup);
  container.appendChild(svg);
}

// Export functions for testing and external use
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
};