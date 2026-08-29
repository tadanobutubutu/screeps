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
 * Builds an adjacency list representation of a dependency graph.
 * @param {Array<Object>} dependencies - List of dependency objects { from, to }
 * @returns {Object} - { nodes: string[], edges: Array, adjacency: Object }
 */
function buildDependencyGraph(dependencies) {
  const nodeSet = new Set();
  const adjacency = {};
  const edges = [];

  if (!Array.isArray(dependencies)) {
    return { nodes: [], edges: [], adjacency: {} };
  }

  dependencies.forEach((dep) => {
    if (!dep || typeof dep !== 'object') return;
    const { from, to } = dep;
    if (!from || !to) return;

    nodeSet.add(from);
    nodeSet.add(to);

    if (!adjacency[from]) adjacency[from] = [];
    adjacency[from].push(to);

    edges.push({ from, to });
  });

  return {
    nodes: Array.from(nodeSet),
    edges,
    adjacency
  };
}

/**
 * Detects cycles in the dependency graph using DFS.
 * @param {Object} graph - Graph object produced by buildDependencyGraph
 * @returns {Array<string>} - List of nodes involved in cycles (empty if none)
 */
function detectCycles(graph) {
  if (!graph || !graph.adjacency) return [];

  const visited = {};
  const stack = {};
  const inCycle = new Set();

  function dfs(node) {
    visited[node] = true;
    stack[node] = true;

    const neighbors = graph.adjacency[node] || [];
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        dfs(neighbor);
      } else if (stack[neighbor]) {
        inCycle.add(node);
        inCycle.add(neighbor);
      }
    }

    stack[node] = false;
  }

  graph.nodes.forEach((node) => {
    if (!visited[node]) dfs(node);
  });

  return Array.from(inCycle);
}

/**
 * Renders a dependency graph as an SVG element.
 * @param {Object} graph - Graph object produced by buildDependencyGraph
 * @param {Object} options - Rendering options { width, height, nodeRadius }
 * @returns {string} - SVG markup string
 */
function renderDependencyGraph(graph, options = {}) {
  if (!graph || !Array.isArray(graph.nodes)) {
    return '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
  }

  const width = options.width || 600;
  const height = options.height || 400;
  const nodeRadius = options.nodeRadius || 20;

  const positions = {};
  const nodeCount = graph.nodes.length || 1;
  graph.nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / nodeCount;
    positions[node] = {
      x: width / 2 + (width / 3) * Math.cos(angle),
      y: height / 2 + (height / 3) * Math.sin(angle)
    };
  });

  const edgeMarkup = graph.edges
    .map((edge) => {
      const from = positions[edge.from];
      const to = positions[edge.to];
      if (!from || !to) return '';
      return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#666" stroke-width="1.5" />`;
    })
    .join('');

  const nodeMarkup = graph.nodes
    .map((node) => {
      const pos = positions[node];
      const safeLabel = String(node).replace(/[<>&"]/g, (c) => ({
        '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'
      }[c]));
      return `<g><circle cx="${pos.x}" cy="${pos.y}" r="${nodeRadius}" fill="#4a90e2" stroke="#2c5d99" stroke-width="2" /><text x="${pos.x}" y="${pos.y + 5}" text-anchor="middle" fill="#fff" font-size="12">${safeLabel}</text></g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${edgeMarkup}${nodeMarkup}</svg>`;
}

/**
 * Renders a dependency graph into a DOM container.
 * @param {string|HTMLElement} container - Container selector or element
 * @param {Array<Object>} dependencies - Dependency list
 * @param {Object} options - Rendering options
 * @returns {boolean} - true on success, false otherwise
 */
function renderDependencyGraphToDOM(container, dependencies, options = {}) {
  if (typeof document === 'undefined') return false;

  const target = typeof container === 'string'
    ? document.getElementById(container) || document.querySelector(container)
    : container;

  if (!target) {
    logger.warn('renderDependencyGraphToDOM: container not found');
    return false;
  }

  const graph = buildDependencyGraph(dependencies);
  target.innerHTML = renderDependencyGraph(graph, options);
  return true;
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
  detectCycles,
  renderDependencyGraph,
  renderDependencyGraphToDOM
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