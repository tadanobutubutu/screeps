// Import lodash library
import _ from 'lodash';

// Import myOtherFunction from another module
import myOtherFunction from './otherModule';

// Function to render dependency graph content
function renderDependencyGraph(data) {
  if (!data) return '';
  const { nodes = [], edges = [] } = data;
  let html = '<div class="dependency-graph"><ul>';
  nodes.forEach(node => {
    const connectedEdges = edges.filter(e => e.from === node.id || e.to === node.id);
    html += `<li data-id="${node.id}">${node.label || node.id} (${connectedEdges.length} connections)</li>`;
  });
  html += '</ul></div>';
  return html;
}

// Function to render index view content
function renderIndexView(data) {
  if (!data) return '<div class="index-view">Index View</div>';
  const { title = 'Index View', items = [] } = data;
  let itemsHtml = items.map(item => `<li>${item.name || item}</li>`).join('');
  return `<div class="index-view"><h1>${title}</h1><ul>${itemsHtml}</ul></div>`;
}

// Function to add proper landmark regions
function addProperLandmarkRegions(data) {
  const landmarkRegions = [];
  const landmarks = data?.landmarks || ['main'];
  
  landmarks.forEach(landmark => {
    const region = {
      role: landmark.role || 'region',
      label: landmark.label || landmark.role || 'content',
      id: landmark.id || `landmark-${landmarkRegions.length}`
    };
    landmarkRegions.push(region);
  });
  
  return landmarkRegions;
}

// New function that needs to be exported with the requested name "myNewFunction"
function myNewFunction() {
  return 'myNewFunction result';
}

// Skip navigation link for keyboard users
function renderSkipLink() {
  return '<a href="#main-content" class="skip-link">Skip to main content</a>';
}

// Original landmark navigation function
function renderLandmarkNavigation() {
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  return landmarks.map(landmark => `<div class="landmark-${landmark}" role="${landmark}"></div>`).join('');
}

// Original utility function
function formatDate(date) {
  if (!date) return '';
  return _.format(date, 'YYYY-MM-DD');
}

// Export the new functions, preserving the existing exports
export { myNewFunction as default, addProperLandmarkRegions, renderDependencyGraph, renderIndexView };
export * from './otherModule';
export { myOtherFunction };