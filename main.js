const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  name: 'ScreepsBot',
  version: '1.0.0',
  debug: false,
  apiUrl: process.env.API_URL || 'https://example.com',
  timeout: 5000,
  landmarkRoles,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50
};

function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

// Accessibility functions for tables (merged from both branches)
function validateTableStructure(tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) {
      console.warn('Table has no rows');
      return false;
  }
  return true;
}

function validateTableAccessibility(tableElement) {
  const issues = [];
  if (!tableElement.querySelector('caption')) {
    issues.push('Table missing caption');
  }
  if (!tableElement.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }
  const headerCells = tableElement.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });
  return issues;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role]');
  let hasMain = false;
  let hasNavigation = false;

  landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
  });

  if (!hasMain) console.warn('Missing main landmark');
  if (!hasNavigation) console.warn('Missing navigation landmark');

  return hasMain && hasNavigation;
}

function ensureUniqueLandmarks() {
  const allLandmarks = document.querySelectorAll('[role]');
  let hasMain = false;
  let hasNavigation = false;

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role === 'main') hasMain = true;
    if (role === 'navigation') hasNavigation = true;
  });

  if (!hasMain) {
    console.warn('Missing main landmark');
  }
  if (!hasNavigation) {
    console.warn('Missing navigation landmark');
  }

  return hasMain && hasNavigation;
}

// Additional functions from origin/main
function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

// Functions to render dependency graphs and index views
/**
 * Render a dependency graph from the provided data structure
 * @param {Object} data - The dependency data to visualize
 * @returns {HTMLElement} The rendered dependency graph element
 */
function renderDependencyGraph(data) {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data provided for dependency graph rendering');
    return null;
  }

  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'region');
  graphContainer.setAttribute('aria-label', 'Dependency Graph');
  graphContainer.className = 'dependency-graph';
  
  // Implementation for rendering graphs would go here
  // For now, this serves as a placeholder that can be expanded
  return graphContainer;
}

/**
 * Render an index view for the provided data
 * @param {Object} data - The data to display in the index view
 * @returns {HTMLElement} The rendered index view element
 */
function renderIndexView(data) {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data provided for index view rendering');
    return null;
  }

  const indexContainer = document.createElement('div');
  indexContainer.setAttribute('role', 'region');
  indexContainer.setAttribute('aria-label', 'Index View');
  indexContainer.className = 'index-view';
  
  // Implementation for rendering index views would go here
  // For now, this serves as a placeholder that can be expanded
  return indexContainer;
}

module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  addLandmarkRegions,
  renderDependencyGraph,
  renderIndexView
};