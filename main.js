// main.js - Main entry point for the dependency graph visualizer

// Import content modules for better maintainability and content separation
import { dependencyGraphContent } from './modules/dependencyGraphContent.js';
import { indexContent } from './modules/indexContent.js';

// Export for testing
export const version = '1.0.0';

// State management
let currentGraph = null;
let currentView = 'index';

// Initialize the application
export function initialize() {
  console.log('Initializing dependency graph visualizer...');
  setupEventListeners();
  renderView('index');
}

// Setup event listeners
function setupEventListeners() {
  document.addEventListener('DOMContentLoaded', () => {
    initialize();
  });
}

// Render the appropriate view based on current state
export function renderView(viewName) {
  currentView = viewName;
  
  switch (viewName) {
    case 'index':
      return renderIndexView();
    case 'dependency-graph':
      return renderDependencyGraphView();
    case 'package-details':
      return renderPackageDetailsView();
    default:
      return renderIndexView();
  }
}

// Render index view - UPDATED to use imported content
function renderIndexView() {
  const container = document.getElementById('app');
  if (container) {
    container.innerHTML = indexContent.getIndexTemplate();
    indexContent.initializeIndexHandlers();
  }
  return container;
}

// Render dependency graph view - UPDATED to use imported content
function renderDependencyGraphView() {
  const container = document.getElementById('graph-container');
  if (container) {
    container.innerHTML = dependencyGraphContent.getGraphTemplate();
    dependencyGraphContent.initializeGraphHandlers();
  }
  return container;
}

// Render package details view
function renderPackageDetailsView() {
  const container = document.getElementById('details-container');
  if (container) {
    container.innerHTML = getPackageDetailsTemplate();
  }
  return container;
}

// Get package details template
function getPackageDetailsTemplate() {
  return `
    <div class="package-details">
      <h2>Package Details</h2>
      <div id="package-info"></div>
    </div>
  `;
}

// Load and display a dependency graph
export function loadDependencyGraph(packageName) {
  currentGraph = packageName;
  
  // Use the dependencyGraphContent module to load the graph
  return dependencyGraphContent.loadGraphData(packageName)
    .then(data => {
      renderDependencyGraphView();
      return data;
    })
    .catch(error => {
      console.error('Error loading dependency graph:', error);
      throw error;
    });
}

// Clear the current graph
export function clearGraph() {
  currentGraph = null;
  const container = document.getElementById('graph-container');
  if (container) {
    container.innerHTML = '';
  }
}

// Get current graph state
export function getCurrentGraph() {
  return currentGraph;
}

// Get current view state
export function getCurrentView() {
  return currentView;
}

// Export for testing
export { renderView };

// The following functions were identified as rendering dependency graphs
// and have been updated to use the dependencyGraphContent module:

/**
 * Renders a node in the dependency graph
 * @param {Object} node - The node data to render
 * @returns {string} HTML string for the node
 */
export function renderGraphNode(node) {
  return dependencyGraphContent.renderNode(node);
}

/**
 * Renders an edge in the dependency graph
 * @param {Object} source - Source node
 * @param {Object} target - Target node
 * @returns {string} SVG path string for the edge
 */
export function renderGraphEdge(source, target) {
  return dependencyGraphContent.renderEdge(source, target);
}

/**
 * Creates the tooltip content for a graph node
 * @param {Object} node - The node data
 * @returns {string} HTML string for the tooltip
 */
export function createNodeTooltip(node) {
  return dependencyGraphContent.createTooltip(node);
}

/**
 * Gets the CSS classes for a node based on its state
 * @param {Object} node - The node data
 * @returns {string} CSS class names
 */
export function getNodeClass(node) {
  return dependencyGraphContent.getNodeClass(node);
}

// Navigation functions
export function goToIndex() {
  renderView('index');
}

export function goToGraph() {
  renderView('dependency-graph');
}

// Export for external use
export default {
  initialize,
  loadDependencyGraph,
  clearGraph,
  renderView,
  renderGraphNode,
  renderGraphEdge,
  createNodeTooltip,
  getNodeClass,
  goToIndex,
  goToGraph,
  getCurrentGraph,
  getCurrentView,
  version
};