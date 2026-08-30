// TODO: This is the existing code that needs to be preserved

// New function: Ensure the element has an id
function ensureElementHasId(element, idPrefix = 'element') {
  if (!element.id) {
    element.id = `${idPrefix}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return element.id;
}

// New function: Add aria-label to an element
function addAriaLabel(element, label) {
  if (label) {
    element.setAttribute('aria-label', label);
  }
}

// New function: Render dependency graphs
function renderDependencyGraph(graphData, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }
  
  const nodes = graphData.nodes || [];
  const edges = graphData.edges || [];
  
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '600');
  svg.setAttribute('height', '400');
  
  edges.forEach(edge => {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', edge.x1);
    line.setAttribute('y1', edge.y1);
    line.setAttribute('x2', edge.x2);
    line.setAttribute('y2', edge.y2);
    line.setAttribute('stroke', '#999');
    svg.appendChild(line);
  });
  
  nodes.forEach(node => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', 10);
    circle.setAttribute('fill', '#69b3a2');
    svg.appendChild(circle);
    
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y - 15);
    text.setAttribute('text-anchor', 'middle');
    text.textContent = node.label;
    svg.appendChild(text);
  });
  
  container.appendChild(svg);
}

module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph
};