const loop = require('./loop');
const config = require('./config');
const logger = require('./utils/logger');

// ----- BEGIN ORIGINAL CODE (unchanged) -----

// Application state
let isInitialized = false;
const appData = {}

/**
 * Checks if a table data array has the required structure
 * @param {Array} tableData - The table data to check
 * @param {Array} requiredColumns - List of required column names
 * @returns {Object} - { valid: boolean, missingColumns: string[] }
 */
function checkTableData(tableData, requiredColumns) {
    if (!Array.isArray(tableData) || tableData.length === 0) {
        return { valid: false, missingColumns: requiredColumns };
    }
    
    const headers = tableData[0];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    return {
        valid: missingColumns.length === 0,
        missingColumns
    };
}

// Implement validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];
  
  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }
  
  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }
  
  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }
  
  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function initialize(options = {}) {
  if (isInitialized) {
    logger.warn('App already initialized');
    return false;
  }
  
  config.set(options);
  isInitialized = true;
  logger.info('Application initialized');
  return true;
}

function getAppState() {
  return {
    isInitialized,
    ...appData
  };
}

function setData(key, value) {
  appData[key] = value;
  return appData;
}

function getData(key) {
  return appData[key];
}

function shutdown() {
  isInitialized = false;
  logger.info('Application shutdown complete');
}

// Additional functions from origin
function newFunction() {
  // Implementation of the new function
  console.log('This is the new function.');
}

function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

// Accessibility features for DOM environment
let insightButton, insightPanel, toggleButton, modal, modalClose;

// Initialize accessibility features
function initializeAccessibility() {
  if (typeof document === 'undefined') return;

  // DOM Elements with proper ARIA attributes
  insightButton = document.getElementById('insight-button');
  insightPanel = document.getElementById('insight-panel');
  toggleButton = document.querySelector('[aria-expanded]');
  modal = document.getElementById('accessible-modal');
  modalClose = document.getElementById('modal-close');

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  interactiveElements.forEach((element, index) => {
    element.setAttribute('tabindex', index === 0 ? '0' : '1');
  });

  // Add focus indicators for keyboard navigation
  const focusStyles = document.createElement('style');
  focusStyles.textContent = `
    :focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
    :focus:not(:focus-visible) {
      outline: none;
    }
    :focus-visible {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(focusStyles);
}

// Toggle insight panel with proper ARIA attributes
function toggleInsightPanel() {
  if (!toggleButton || !insightPanel) return;

  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  toggleButton.setAttribute('aria-expanded', !isExpanded);
  insightPanel.hidden = isExpanded;
  
  if (!isExpanded) {
    // Move focus to panel when opened for screen readers
    insightPanel.focus();
  }
}

// Modal handling with focus management (accessibility requirement)
function openModal() {
  if (!modal) return;

  modal.hidden = false;
  modal.setAttribute('aria-modal', 'true');
  
  // Focus trap management
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (firstElement) {
    firstElement.tabIndex = 0;
    
    lastElement.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        firstElement.focus();
      }
    });

    firstElement.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        lastElement.focus();
      }
    });

    // Focus first element
    firstElement?.focus();
  }

  // Close on Escape key
  document.addEventListener('keydown', handleEscapeKey);
  
  // Store trigger element to return focus
  const trigger = document.activeElement;
  modal.dataset.triggerId = trigger?.id || 'modal-trigger';
}

function closeModal() {
  if (!modal) return;

  modal.hidden = true;
  modal.removeAttribute('aria-modal');
  
  // Return focus to trigger element
  const triggerId = modal.dataset.triggerId;
  const trigger = document.getElementById(triggerId);
  trigger?.focus();
  
  // Remove escape key listener
  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

// Setup event listeners
function setupAccessibilityEventListeners() {
  if (typeof document === 'undefined') return;

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (insightButton) {
    insightButton.addEventListener('click', toggleInsightPanel);
    // Ensure keyboard accessibility
    insightButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleInsightPanel();
      }
    });
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleInsightPanel);
    toggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleInsightPanel();
      }
    });
  }
}

// ----- DEPENDENCY GRAPH RENDERING FUNCTIONS -----

/**
 * Builds a dependency graph from a list of modules and their dependencies
 * @param {Array<{name: string, dependencies: string[]}>} modules - List of modules with their dependencies
 * @returns {Object} - Graph representation with nodes and edges
 */
function buildDependencyGraph(modules) {
  if (!Array.isArray(modules)) {
    logger.error('buildDependencyGraph expects an array of modules');
    return { nodes: [], edges: [] };
  }

  const nodes = modules.map(m => ({ id: m.name, label: m.name }));
  const edges = [];

  modules.forEach(module => {
    if (Array.isArray(module.dependencies)) {
      module.dependencies.forEach(dep => {
        edges.push({ from: module.name, to: dep });
      });
    }
  });

  return { nodes, edges };
}

/**
 * Detects circular dependencies within a graph structure
 * @param {Object} graph - Graph object with nodes and edges
 * @returns {Array<string[]>} - List of cycles found, each as an array of node ids
 */
function detectCircularDependencies(graph) {
  const cycles = [];
  if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    return cycles;
  }

  const adjacency = {};
  graph.nodes.forEach(node => { adjacency[node.id] = []; });
  graph.edges.forEach(edge => {
    if (adjacency[edge.from]) {
      adjacency[edge.from].push(edge.to);
    }
  });

  const visited = new Set();
  const stack = new Set();

  function dfs(node, path) {
    if (stack.has(node)) {
      const cycleStart = path.indexOf(node);
      if (cycleStart !== -1) {
        cycles.push(path.slice(cycleStart).concat(node));
      }
      return;
    }
    if (visited.has(node)) return;

    visited.add(node);
    stack.add(node);
    path.push(node);

    (adjacency[node] || []).forEach(neighbor => {
      dfs(neighbor, path);
    });

    path.pop();
    stack.delete(node);
  }

  graph.nodes.forEach(node => {
    dfs(node.id, []);
  });

  return cycles;
}

/**
 * Renders a dependency graph into an SVG element
 * @param {Object} graph - Graph object with nodes and edges
 * @param {string} containerId - DOM element id to render into
 * @returns {boolean} - True if rendered successfully
 */
function renderDependencyGraph(graph, containerId) {
  if (typeof document === 'undefined') {
    logger.warn('renderDependencyGraph requires a DOM environment');
    return false;
  }
  if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    logger.error('Invalid graph provided to renderDependencyGraph');
    return false;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    logger.error(`Container element with id "${containerId}" not found`);
    return false;
  }

  // Clear existing content
  container.innerHTML = '';

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '400');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency graph visualization');

  const nodeRadius = 25;
  const positions = {};

  // Simple positioning: arrange nodes in a circle
  graph.nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / Math.max(graph.nodes.length, 1);
    positions[node.id] = {
      x: 200 + 150 * Math.cos(angle),
      y: 200 + 150 * Math.sin(angle)
    };
  });

  // Draw edges
  graph.edges.forEach(edge => {
    const from = positions[edge.from];
    const to = positions[edge.to];
    if (!from || !to) return;

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', from.x);
    line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x);
    line.setAttribute('y2', to.y);
    line.setAttribute('stroke', '#666');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
  });

  // Draw nodes
  graph.nodes.forEach(node => {
    const pos = positions[node.id];
    if (!pos) return;

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', nodeRadius);
    circle.setAttribute('fill', '#4a90e2');
    circle.setAttribute('stroke', '#2c5d8f');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', pos.x);
    text.setAttribute('y', pos.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', '12');
    text.textContent = node.label || node.id;
    svg.appendChild(text);
  });

  container.appendChild(svg);
  logger.info(`Dependency graph rendered into "${containerId}"`);
  return true;
}

/**
 * Updates an existing dependency graph in the DOM
 * @param {Object} graph - Graph object with nodes and edges
 * @param {string} containerId - DOM element id to update
 * @returns {boolean} - True if updated successfully
 */
function updateDependencyGraph(graph, containerId) {
  if (typeof document === 'undefined') {
    logger.warn('updateDependencyGraph requires a DOM environment');
    return false;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    logger.error(`Container element with id "${containerId}" not found`);
    return false;
  }

  return renderDependencyGraph(graph, containerId);
}

/**
 * Generates an HTML/text representation of a dependency graph
 * @param {Object} graph - Graph object with nodes and edges
 * @returns {string} - Text representation of the graph
 */
function graphToText(graph) {
  if (!graph || !Array.isArray(graph.nodes)) return '';

  const lines = ['Dependency Graph:'];
  lines.push(`  Nodes: ${graph.nodes.length}`);
  lines.push(`  Edges: ${Array.isArray(graph.edges) ? graph.edges.length : 0}`);

  if (Array.isArray(graph.edges) && graph.edges.length > 0) {
    lines.push('  Dependencies:');
    graph.edges.forEach(edge => {
      lines.push(`    ${edge.from} -> ${edge.to}`);
    });
  }

  return lines.join('\n');
}

// Export functions for testing
module.exports = {
  loop,
  validateLandmark,
  checkTableData,
  initialize,
  getAppState,
  setData,
  getData,
  shutdown,
  config,
  logger,
  newFunction,
  modifiedFunction,
  initializeAccessibility,
  toggleInsightPanel,
  openModal,
  closeModal,
  setupAccessibilityEventListeners,
  buildDependencyGraph,
  detectCircularDependencies,
  renderDependencyGraph,
  updateDependencyGraph,
  graphToText
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeAccessibility();
      setupAccessibilityEventListeners();
    });
  } else {
    initializeAccessibility();
    setupAccessibilityEventListeners();
  }
}