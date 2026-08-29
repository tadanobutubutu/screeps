// Main entry point for the application
const { ModuleRegistry } = require('./modules');
const { buildDependencyGraph } = require('./graphBuilder');

// ... existing code ...

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

/**
 * Renders a dependency graph visualization to the specified container.
 * @param {HTMLElement} container - The DOM element to render the graph into
 * @returns {void}
 */
function renderDependencyGraph(container) {
  const graphData = buildDependencyGraph();
  
  // Clear previous content if exists
  if (container) {
    container.innerHTML = '';
  }
  
  // Create SVG or HTML representation of the dependency graph
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '600');
  svg.style.border = '1px solid #ccc';
  
  // Simple example graph structure - in practice this would be dynamic
  const nodes = [
    { id: 'core', label: 'Core', color: '#007bff' },
    { id: 'utils', label: 'Utils', color: '#28a745' },
    { id: 'models', label: 'Models', color: '#6c757d' },
    { id: 'controllers', label: 'Controllers', color: '#fd7e14' },
    { id: 'routes', label: 'Routes', color: '#17a2b8' }
  ];
  
  nodes.forEach(node => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Draw node
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '15');
    circle.setAttribute('fill', node.color);
    circle.setAttribute('stroke', '#fff');
    circle.setAttribute('stroke-width', '2');
    g.appendChild(circle);
    
    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = node.label;
    text.setAttribute('x', '50');
    text.setAttribute('y', '55');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#333');
    g.appendChild(text);
    
    // Connect to core if applicable
    if (node.id === 'core') {
      const link = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      link.setAttribute('x1', '150');
      link.setAttribute('y1', '50');
      link.setAttribute('x2', '250');
      link.setAttribute('y2', '50');
      link.setAttribute('stroke', '#999');
      link.setAttribute('stroke-width', '1');
      g.appendChild(link);
    }
    
    container.appendChild(g);
  });
  
  container.appendChild(svg);
}

/**
 * Displays the module structure hierarchy for debugging purposes.
 * @param {Object} module - The module object containing name, dependencies, and children
 * @returns {void}
 */
function displayModuleStructure(module) {
  const indent = 0;
  const prefix = '  '.repeat(indent);
  
  function printNode(name, depth) {
    const div = document.createElement('div');
    div.className = 'module-structure';
    div.innerHTML = `<strong>${name}</strong>`;
    
    if (depth > 0) {
      div.innerHTML += '<br>';
    }
    
    // Show dependencies
    if (module.dependencies && Object.keys(module.dependencies).length > 0) {
      Object.entries(module.dependencies).forEach(([dep, _]) => {
        const depDiv = document.createElement('div');
        depDiv.className = 'dependency';
        depDiv.innerHTML = `<span class="arrow">→</span><span>${dep}</span>`;
        div.appendChild(depDiv);
        
        // Recursive call for dependencies
        printNode(dep, depth + 1);
      });
    }
    
    // Show children
    if (module.children && Object.keys(module.children).length > 0) {
      Object.values(module.children).forEach(child => {
        printNode(child.name, depth + 1);
      });
    }
    
    return div;
  }
  
  printNode(module.name, 0);
}

// Export existing exports plus new functions
module.exports = {
  // ... existing exports ...
  renderDependencyGraph,
  displayModuleStructure
};