// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

/**
 * Ensures that the given element has an id attribute.
 * If the element doesn't have an id, one is generated and assigned.
 * @param {HTMLElement} element - The element to ensure has an id
 * @param {string} [prefix] - Optional prefix for the generated id
 * @returns {string} The id of the element
 */
export function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text for aria-label
 * @returns {HTMLElement} The element with aria-label added
 */
export function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!label || typeof label !== 'string') {
    throw new Error('Label must be a non-empty string');
  }
  
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  
  return element;
}

/**
 * Renders a dependency graph visualization.
 * @param {HTMLElement} container - The container element to render the graph in
 * @param {Object} dependencies - The dependency data object
 * @param {Object} [options] - Optional configuration for the graph
 * @returns {HTMLCanvasElement} The canvas element containing the rendered graph
 */
export function renderDependencyGraph(container, dependencies = {}, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  const width = options.width || 600;
  const height = options.height || 400;
  const nodeRadius = options.nodeRadius || 20;
  const padding = options.padding || 40;
  
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.setAttribute('aria-label', 'Dependency graph visualization');
  
  const ctx = canvas.getContext('2d');
  
  // Build nodes from dependencies
  const nodes = [];
  const nodeMap = new Map();
  const depKeys = Object.keys(dependencies);
  
  depKeys.forEach((key, index) => {
    const node = {
      id: key,
      x: padding + (index % 5) * ((width - 2 * padding) / Math.min(5, depKeys.length)),
      y: padding + Math.floor(index / 5) * ((height - 2 * padding) / Math.ceil(depKeys.length / 5))
    };
    nodes.push(node);
    nodeMap.set(key, node);
  });
  
  // Draw connections
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  
  depKeys.forEach(key => {
    const deps = dependencies[key];
    if (Array.isArray(deps)) {
      deps.forEach(dep => {
        const fromNode = nodeMap.get(dep);
        const toNode = nodeMap.get(key);
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();
        }
      });
    }
  });
  
  // Draw nodes
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#4A90D9';
    ctx.fill();
    ctx.strokeStyle = '#2C5F9E';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw node label
    ctx.fillStyle = '#FFF';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = node.id.length > 8 ? node.id.substring(0, 7) + '…' : node.id;
    ctx.fillText(label, node.x, node.y);
  });
  
  container.appendChild(canvas);
  return canvas;
}

/**
 * Main initialization function
 */
export function init() {
  console.log('Main module initialized');
}

export default {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  init
};