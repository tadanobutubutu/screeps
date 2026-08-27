// Add new functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Ensures the element has an id attribute. If it doesn't have one, generates and assigns one.
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} [prefix='element'] - Optional prefix for the generated id
 * @returns {string} The element's id
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id && element.id.trim() !== '') {
    return element.id;
  }
  
  const generatedId = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = generatedId;
  return generatedId;
}

/**
 * Adds an aria-label attribute to the element if it doesn't have one.
 * @param {HTMLElement} element - The DOM element
 * @param {string} label - The aria-label value to set
 * @returns {boolean} True if label was added, false if it already existed
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!label || typeof label !== 'string') {
    throw new Error('Label must be a non-empty string');
  }
  
  const existingLabel = element.getAttribute('aria-label');
  if (existingLabel && existingLabel.trim() !== '') {
    return false;
  }
  
  element.setAttribute('aria-label', label);
  return true;
}

/**
 * Renders dependency graphs in the main application.
 * @param {HTMLElement} container - The container element to render graphs into
 * @param {Object} options - Configuration options for the graph
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraphs(container, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  const {
    width = container.clientWidth || 800,
    height = container.clientHeight || 600,
    nodeRadius = 20,
    linkDistance = 100
  } = options;
  
  // Initialize graph structure
  const graph = {
    nodes: [],
    links: [],
    width,
    height,
    nodeRadius,
    linkDistance
  };
  
  // Create SVG container
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency graph visualization');
  
  container.innerHTML = '';
  container.appendChild(svg);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .graph-node {
      fill: #4A90E2;
      stroke: #357ABD;
      stroke-width: 2px;
      cursor: pointer;
    }
    .graph-node:hover {
      fill: #357ABD;
    }
    .graph-link {
      stroke: #999;
      stroke-width: 1.5px;
      stroke-opacity: 0.6;
    }
    .graph-label {
      font-family: Arial, sans-serif;
      font-size: 12px;
      fill: #333;
      text-anchor: middle;
      pointer-events: none;
    }
  `;
  svg.appendChild(style);
  
  return {
    graph,
    svg,
    addNode: function(id, data = {}) {
      const node = { id, ...data, x: data.x || Math.random() * width, y: data.y || Math.random() * height };
      graph.nodes.push(node);
      return node;
    },
    addLink: function(source, target, data = {}) {
      graph.links.push({ source, target, ...data });
    },
    render: function() {
      // Clear existing content except styles
      const styleElement = svg.querySelector('style');
      svg.innerHTML = '';
      svg.appendChild(styleElement);
      
      // Render links
      const linksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      linksGroup.setAttribute('class', 'links');
      graph.links.forEach(link => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'graph-link');
        const sourceNode = typeof link.source === 'object' ? link.source : graph.nodes.find(n => n.id === link.source);
        const targetNode = typeof link.target === 'object' ? link.target : graph.nodes.find(n => n.id === link.target);
        if (sourceNode && targetNode) {
          line.setAttribute('x1', sourceNode.x);
          line.setAttribute('y1', sourceNode.y);
          line.setAttribute('x2', targetNode.x);
          line.setAttribute('y2', targetNode.y);
          linksGroup.appendChild(line);
        }
      });
      svg.appendChild(linksGroup);
      
      // Render nodes
      const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodesGroup.setAttribute('class', 'nodes');
      graph.nodes.forEach(node => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'graph-node');
        circle.setAttribute('r', graph.nodeRadius);
        g.appendChild(circle);
        
        if (node.label) {
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('class', 'graph-label');
          text.setAttribute('dy', graph.nodeRadius + 15);
          text.textContent = node.label;
          g.appendChild(text);
        }
        
        nodesGroup.appendChild(g);
      });
      svg.appendChild(nodesGroup);
    }
  };
}

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
};