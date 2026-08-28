// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

/**
 * Ensures the element has an id, generating one if necessary
 * @param {HTMLElement} element - The element to check
 * @param {string} [prefix] - Optional prefix for generated id
 * @returns {string} The element's id
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

/**
 * Adds aria-label to an element if it doesn't already have one
 * @param {HTMLElement} element - The element to update
 * @param {string} label - The aria-label to add
 */
function addAriaLabel(element, label) {
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Renders dependency graphs for the given element
 * @param {HTMLElement} element - The container element for the graph
 * @param {Object} dependencies - The dependency data to render
 */
function renderDependencyGraph(element, dependencies) {
  ensureElementHasId(element, 'dependency-graph');
  
  const canvas = document.createElement('canvas');
  canvas.id = `${element.id}-canvas`;
  canvas.width = element.width || 600;
  canvas.height = element.height || 400;
  
  element.appendChild(canvas);
  addAriaLabel(canvas, 'Dependency graph visualization');
  
  // Basic rendering logic for dependency graph
  const ctx = canvas.getContext('2d');
  if (ctx && dependencies.nodes) {
    renderGraphContent(ctx, canvas, dependencies);
  }
  
  return canvas;
}

/**
 * Internal function to render graph content
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} dependencies - Dependency data
 */
function renderGraphContent(ctx, canvas, dependencies) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const nodes = dependencies.nodes || [];
  const links = dependencies.links || [];
  
  // Draw nodes
  nodes.forEach((node, index) => {
    const x = (index % 10) * 60 + 30;
    const y = Math.floor(index / 10) * 60 + 30;
    
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#4A90E2';
    ctx.fill();
    ctx.stroke();
    
    if (node.label) {
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, x, y + 4);
    }
  });
  
  // Draw links
  ctx.strokeStyle = '#999';
  links.forEach(link => {
    if (link.source && link.target) {
      ctx.beginPath();
      ctx.moveTo(link.source.x || 0, link.source.y || 0);
      ctx.lineTo(link.target.x || 0, link.target.y || 0);
      ctx.stroke();
    }
  });
}

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  renderGraphContent
};