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

/**
 * Creates a basic tower defense game board visualization.
 * @param {HTMLElement} container - The parent element to append the board to
 * @param {number} width - Board width (default 800)
 * @param {number} height - Board height (default 600)
 * @returns {HTMLElement} The created SVG board element
 */
function createTowerDefenseMap(container, width = 800, height = 600) {
  if (!container) {
    throw new Error('Container is required');
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', width);
  bg.setAttribute('height', height);
  bg.setAttribute('fill', '#f0f0f0');
  svg.appendChild(bg);

  // Grid lines
  for (let i = 0; i < width; i += 50) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', i);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', i);
    line.setAttribute('y2', height);
    line.setAttribute('stroke', '#ddd');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }

  // Sample towers
  const tower1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  tower1.setAttribute('points', '50,450 80,430 160,470');
  tower1.setAttribute('fill', '#3498db');
  svg.appendChild(tower1);
  
  const tower2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  tower2.setAttribute('points', '300,460 380,440 490,510');
  tower2.setAttribute('fill', '#2ecc71');
  svg.appendChild(tower2);

  // Label
  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', width / 2);
  label.setAttribute('y', 30);
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('font-family', 'sans-serif');
  label.setAttribute('font-size', '16');
  label.setAttribute('fill', '#333');
  label.textContent = 'Tower Defense Map';
  svg.appendChild(label);

  return svg;
}

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  createTowerDefenseMap,
  myFunction: function () {
    // Existing implementation
  }
};