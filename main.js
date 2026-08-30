// ----- BEGIN ORIGINAL CODE (unchanged) -----
// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};
let uniqueLandmarks = {};

// Helper functions for distance calculation (used by landmark region logic)
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('.dependency-graph, [data-dependency-graph]') ||
    document.querySelector('.dependencyGraph') ||
    document.querySelector('[data-testid="dependency-graph"]') ||
    document.querySelector('div[data-testid=dependency-graph]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  // New accessibility functions
  function improveAccessibility() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent || 'Button');
      }
    });

    const focusable = document.querySelectorAll('[role="link"]');
    focusable.forEach(el => {
      if (el.tabIndex < 0) el.tabIndex = 0;
    });
  }

  function ensureUniqueLandmarks(insightReport) {
    const landmarks = [...new Set(insightReport.issues.flatMap(issue => issue.ariaRole))];

    // Check if all landmarks exist, re-add if necessary
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      if (elements.length < landmarks.length) {
        const uniqueLandmarkMap = {};

        landmarks.forEach(uniqueLandmark => {
          let element = elements.filter(el => el.getAttribute('role') === uniqueLandmark);
          if (!element[0]) {
            element = document.createElement(`div`);
            element.setAttribute('role', uniqueLandmark);
            if (!document.querySelector(`#${uniqueLandmark}`)) {
              const id = uniqueLandmark;
              element.setAttribute('id', id);
            }
            document.body.appendChild(element);
          }
          uniqueLandmarkMap[uniqueLandmark] = element[0];
        });
        uniqueLandmarks = uniqueLandmarkMap;
      }
    });
  }
}

// New function to render dependency graphs
function renderDependencyGraph(moduleName) {
  // Placeholder for actual implementation
  console.log(`Rendering dependency graph for module: ${moduleName}`);
  // Assume some logic here to actually render the graph
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
  addProperLandmarkRegions
};
// ----- END ORIGINAL CODE -----