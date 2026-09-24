// ----- BEGIN ORIGINAL CODE (unchanged) -----
// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

const config = require('./config');
const logger = require('./utils/logger');
const { someModule } = require('some-module');

// Application state
let isInitialized = false;
const appData = {};
let uniqueLandmarks = {};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Convert degrees to radians
function toRad(deg) {
  return deg * (Math.PI / 180);
}

function addressAccessibilityIssues() {
  // REACT_015: Add lang attribute to HTML element
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    const lang = htmlElement.getAttribute('xml:lang') || 'en';
    htmlElement.setAttribute('lang', lang);
  }

  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('[data-dependency-graph]') ||
    document.querySelector('.dependency-graph') ||
    document.querySelector('#dependency-graph') ||
    document.querySelector('div[data-type="dependency-graph"]');

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
      if (!button.hasAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
        button.setAttribute('aria-label', button.textContent || 'Button');
      }
    });

    const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  function ensureUniqueLandmarks() {
    const landmarks = [...new Set([...document.querySelectorAll('[role]')].map(el => el.getAttribute('role')))];

    // Check if all landmarks exist, re-add if necessary
    landmarks.forEach(uniqueLandmark => {
      const elements = document.querySelectorAll(`[role="${uniqueLandmark}"]`);
      if (elements.length < landmarks.length) {
        const uniqueLandmarkMap = {};

        landmarks.forEach(uniqueLand => {
          let element = elements.filter(el => el.getAttribute('role') === uniqueLand);
          if (!element[0]) {
            element = document.createElement('div');
            element.setAttribute('role', uniqueLand);
            if (!element.id) {
              const id = uniqueLand;
              element.setAttribute('id', id);
            }
            element = element[0] || element;
          }
          uniqueLandmarkMap[uniqueLand] = element[0];
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

// New function to display module structure
function displayModuleStructure(moduleName) {
  // Placeholder for actual implementation
  console.log(`Displaying module structure for module: ${moduleName}`);
  // Assume some logic here to actually display the structure
}

// TODO: This is the new function request
function newFunction() {
  // Implement the new function here
  console.log("New Function has been called!");
}

// New function: ensure elements have proper landmark regions with ids and aria-labels
function addProperLandmarkRegions() {
  // Define the landmark roles we want to ensure are present and accessible
  const landmarkRoles = ['banner', 'main', 'contentinfo', 'navigation', 'complementary', 'region'];

  landmarkRoles.forEach(role => {
    // Find existing elements with this landmark role
    const elements = document.querySelectorAll(`[role="${role}"]`);

    if (elements.length === 0) {
      // No element with this role exists; create one and append to body
      const element = document.createElement('div');
      element.setAttribute('role', role);

      // Ensure the element has an id
      if (!element.getAttribute('id')) {
        const generatedId = `${role}-landmark`;
        // Make sure the id is unique in the document
        if (!document.getElementById(generatedId)) {
          element.setAttribute('id', generatedId);
        } else {
          // Append a unique counter to avoid id collision
          let counter = 1;
          let uniqueId = `${generatedId}-${counter}`;
          while (document.getElementById(uniqueId)) {
            counter += 1;
            uniqueId = `${generatedId}-${counter}`;
          }
          element.setAttribute('id', uniqueId);
        }
      }

      // Add an aria-label so assistive tech can announce the region meaningfully
      if (!element.getAttribute('aria-label')) {
        const labelMap = {
          banner: 'Site banner',
          main: 'Main content',
          contentinfo: 'Site information',
          navigation: 'Site navigation',
          complementary: 'Complementary content',
          region: 'Generic region'
        };
        element.setAttribute('aria-label', labelMap[role] || role);
      }

      document.body.appendChild(element);
    } else {
      // Existing landmark elements: ensure each has an id and an aria-label
      elements.forEach((el, index) => {
        if (!el.getAttribute('id')) {
          const baseId = `${role}-landmark`;
          let candidateId = elements.length > 1 ? `${baseId}-${index + 1}` : baseId;
          if (document.getElementById(candidateId)) {
            let counter = 1;
            let uniqueId = `${candidateId}-${counter}`;
            while (document.getElementById(uniqueId)) {
              counter += 1;
              uniqueId = `${candidateId}-${counter}`;
            }
            candidateId = uniqueId;
          }
          el.setAttribute('id', candidateId);
        }

        if (!el.getAttribute('aria-label')) {
          const labelMap = {
            banner: 'Site banner',
            main: 'Main content',
            contentinfo: 'Site information',
            navigation: 'Site navigation',
            complementary: 'Complementary content',
            region: 'Generic region'
          };
          el.setAttribute('aria-label', labelMap[role] || role);
        }
      });
    }
  });
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  renderDependencyGraph,
  displayModuleStructure,
  newFunction,
  uniqueLandmarks
};