const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};
let uniqueLandmarks = {};

function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('[data-dependency-graph]') ||
    document.querySelector('.dependency-graph') ||
    document.querySelector('#dependency-graph') ||
    document.querySelector('main');

  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    if (!dependencyGraph.getAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }

  // New accessibility functions
  function improveAccessibility() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent || 'Button');
      }
    });

    const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  function maintainLandmarks() {
    const landmarks = [...new Set(['navigation', 'main', 'complementary', 'banner', 'contentinfo'].filter(Boolean))];

    // Check if all landmarks exist, re-add if necessary
    landmarks.forEach(uniqueLandmark => {
      const elements = document.querySelectorAll(`[role="${uniqueLandmark}"]`);
      if (elements.length < landmarks.length) {
        const uniqueLandmarkMap = {};

        landmarks.forEach(uniqueLandmark => {
          let element = elements.filter(el => el.getAttribute('role') === uniqueLandmark);
          if (!element[0]) {
            element = document.createElement('div');
            element.setAttribute('role', uniqueLandmark);
            if (!element.id) {
              const id = uniqueLandmark;
              element.setAttribute('id', id);
            }
            document.body.appendChild(element);
          }
          uniqueLandmarkMap[uniqueLandmark] = element[0];
        });
      }
    });
  }
}

// TODO: Implement renderIndexView functionality
function renderIndexView() {
  const container = document.querySelector('[data-dependency-graph]') ||
    document.querySelector('.dependency-graph') ||
    document.querySelector('#dependency-graph') ||
    document.querySelector('main') ||
    document.body;

  container.innerHTML = '';

  const indexView = document.createElement('div');
  indexView.className = 'index-view';
  indexView.setAttribute('role', 'main');
  indexView.setAttribute('aria-label', 'Index View');

  const header = document.createElement('header');
  header.setAttribute('role', 'banner');
  header.innerHTML = '<h1>Dependency Graph Index</h1>';

  const mainContent = document.createElement('div');
  mainContent.className = 'index-content';
  mainContent.setAttribute('role', 'region');
  mainContent.setAttribute('aria-label', 'Main Content');

  const description = document.createElement('p');
  description.textContent = 'Welcome to the dependency graph visualization.';
  description.setAttribute('aria-label', 'Welcome message');

  mainContent.appendChild(description);

  const graphContainer = document.createElement('div');
  graphContainer.className = 'graph-container';
  graphContainer.setAttribute('role', 'tree');
  graphContainer.setAttribute('aria-label', 'Dependency Graph');

  mainContent.appendChild(graphContainer);

  indexView.appendChild(header);
  indexView.appendChild(mainContent);
  container.appendChild(indexView);

  // Apply accessibility improvements
  addressAccessibilityIssues();

  logger.info('Index view rendered successfully');
  return indexView;
}

module.exports = {
  renderIndexView,
  addressAccessibilityIssues,
  config,
  appData,
  uniqueLandmarks,
  isInitialized
};