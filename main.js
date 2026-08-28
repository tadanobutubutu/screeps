// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

const dependencyGraphContainer = document.getElementById('dependencyGraph');

if (dependencyGraphContainer) {
  dependencyGraphContainer.setAttribute('role', 'img');
  dependencyGraphContainer.setAttribute('aria-label', 'Dependency graph showing project module relationships');
}

function visualizeDependencies(dependencies) {
  if (!dependencyGraphContainer) {
    console.error('Dependency graph container not found');
    return;
  }
  
  const nodes = [];
  const edges = [];
  
  dependencies.forEach(dep => {
    nodes.push({ id: dep.name, label: dep.name });
    if (dep.dependencies) {
      dep.dependencies.forEach(subDep => {
        edges.push({ from: dep.name, to: subDep });
      });
    }
  });
  
  renderGraph(nodes, edges);
}

function renderGraph(nodes, edges) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '400');
  svg.setAttribute('aria-hidden', 'true');
  
  let x = 50;
  let y = 50;
  
  nodes.forEach((node, index) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x + (index % 5) * 70);
    circle.setAttribute('cy', y + Math.floor(index / 5) * 70);
    circle.setAttribute('r', '25');
    circle.setAttribute('fill', '#4A90D9');
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + (index % 5) * 70);
    text.setAttribute('y', y + Math.floor(index / 5) * 70 + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '10');
    text.textContent = node.label.substring(0, 8);
    
    svg.appendChild(circle);
    svg.appendChild(text);
  });
  
  if (dependencyGraphContainer) {
    dependencyGraphContainer.appendChild(svg);
  }
}

function init() {
  const sampleDependencies = [
    { name: 'main', dependencies: ['moduleA', 'moduleB'] },
    { name: 'moduleA', dependencies: ['moduleC'] },
    { name: 'moduleB', dependencies: ['moduleC', 'moduleD'] },
    { name: 'moduleC', dependencies: [] },
    { name: 'moduleD', dependencies: ['moduleA'] }
  ];
  
  visualizeDependencies(sampleDependencies);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { visualizeDependencies, renderGraph, init };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}