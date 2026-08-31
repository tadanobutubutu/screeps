// TODO: This is the existing code that needs to be preserved

// ... EXISTING CODE HERE ...

// New function: Renders a dependency graph using the new functions
function renderDependencyGraphV2(data, container, customNodeFunction, customEdgeFunction) {
  if (!data) {
    throw new Error('Dependency data is required');
  }

  const graphContainer = container || document.createElement('div');
  graphContainer.className = 'dependency-graph';

  const svg = renderSvg(graphContainer);

  // Render nodes
  if (data.nodes && Array.isArray(data.nodes)) {
    data.nodes.forEach((node, index) => {
      const nodeElement = customNodeFunction ? customNodeFunction(node, index) : renderNode(node, index);
      svg.appendChild(nodeElement);
    });
  }

  // Render edges
  if (data.edges && Array.isArray(data.edges)) {
    data.edges.forEach(edge => {
      const edgeElement = customEdgeFunction ? customEdgeFunction(edge) : renderEdge(edge);
      svg.appendChild(edgeElement);
    });
  }

  graphContainer.appendChild(svg);
  ensureElementHasId(graphContainer);
  addAriaLabel(graphContainer, 'Dependency graph visualization');

  return graphContainer;
}

// New function: Renders an SVG element
function renderSvg(container) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 600');

  container.appendChild(svg);
  return svg;
}

// New function: Renders a node (circle and text)
function renderNode(node, index) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('r', '30');
  circle.setAttribute('fill', node.color || '#4A90E2');

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dy', '.35em');
  text.textContent = node.name || node.id || index;

  g.appendChild(circle);
  g.appendChild(text);

  return g;
}

// New function: Renders an edge (line)
function renderEdge(edge) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', edge.sourceX || 0);
  line.setAttribute('y1', edge.sourceY || 0);
  line.setAttribute('x2', edge.targetX || 0);
  line.setAttribute('y2', edge.targetY || 0);
  line.setAttribute('stroke', '#999');
  line.setAttribute('stroke-width', '2');

  return line;
}

// ... EXISTING CODE HERE ...