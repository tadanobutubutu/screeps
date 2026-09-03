// main.js - Main application entry point

// Main module

// Dependency imports
const dependencyGraphContent = require('./dependencyGraphContent').dependencyGraphContent;
const indexContent = require('./indexContent').indexContent;
const http = require('http');
const url = require('url');
const a11yStore = require('./utilities/a11yStore');

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
} = require('./mathHelpers');

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

const renderGraphIndex = (graphData) => {
  // Address accessibility issues from insight report
  ensureDependencyGraphAccessibility(document.querySelector('.dependency-graph-container'));
  renderDependencyGraphs(graphData);
};

// Required function implementations

/**
 * Rendering dependency graphs with accessibility enhancements
 * @param {Object} graphData - Data for rendering dependency graphs
 */
function renderDependencyGraphs(graphData) {
  if (typeof document === 'undefined') return;

  // Remove any existing graph containers
  const existingContainers = document.querySelectorAll('.dependency-graph-container');
  existingContainers.forEach(container => container.remove());

  // Create new container
  const container = document.createElement('div');
  container.className = 'dependency-graph-container';
  container.setAttribute('role', 'region');

  // Render the graph
  const graphHtml = renderDependencyGraph(graphData);
  container.innerHTML = graphHtml;

  // Add to document
  const mainElement = document.querySelector('main') || document.body;
  mainElement.appendChild(container);
}

// New functions (merged changes from both versions)
function ensureInteractiveElementsAccessible() {
  a11yStore.ensureInteractiveRoles();
  a11yStore.addFormControlLabels();
  a11yStore.ensureImageAccessibility();
}

// Function to handle initial accessibility setup (merged changes from both versions)
function handleInitialAccessibility() {
  a11yStore.checkLandmarkElements(); // Add this line
  a11yStore.addSVGAccessibilityProps();
  a11yStore.fixFakeLinks();
  a11yStore.updateLiveRegion('Initial accessibility enhancements applied');
  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(fixTableStructure);
  ensureInteractiveElementsAccessible();

  // HTTP Server setup (added from the merged version)
  const server = http.createServer((req, res) => {
    // ...
  });

  // ...
}

// New function for checking landmark elements
function checkLandmarkElements() {
  const landmarks = document.querySelectorAll('[aria-label^="landmark-"]');

  if (!landmarks.length) {
    return;
  }

  landmarks.forEach((landmark, index) => {
    const landmarkType = landmark.getAttribute('aria-label').split('-')[1];

    // Ensure landmarks are nested according to their types
    if (index > 0) {
      const previousLandmarkType = landmarks[index - 1].getAttribute('aria-label').split('-')[1];
      const expectedNextLandmarkType = getNextLandmarkType(landmarkType, previousLandmarkType);

      if (landmarks[index].parentElement.nodeName !== expectedNextLandmarkType) {
        throw new Error(`Landmarks ${landmarkType} and ${expectedNextLandmarkType} are not properly nested`);
      }
    }

    // Check if landmark has a heading as its first child
    const heading = landmark.firstChild;
    if (!heading || heading.nodeName !== 'H1' || !(heading.parentElement === landmark)) {
      throw new Error(`Landmark ${landmarkType} does not have a heading as its first child`);
    }
  });
}

function getNextLandmarkType(landmarkType, previousLandmarkType) {
  switch (landmarkType) {
    case 'banner':
      return 'navigation';
    case 'navigation':
      return 'main';
    case 'main':
      return 'article';
    case 'article':
      return 'navigation';
    case 'aside':
      return 'main';
    case 'footer':
      return null; // Footer doesn't have a next landmark
    default:
      throw new Error(`Unsupported landmark type: ${landmarkType}`);
  }
}

// Export modules for testing
module.exports = {
  renderDependencyGraph,
  renderIndex,
  ensureDependencyGraphAccessibility,
  validateSession,
  getActiveSessionsCount,
  server,
  sanitizeFilename,
  processData,
  revokeSession,
  addSvgAccessibilityProps: a11yStore.addSVGAccessibilityProps,
  isLandmarkElement,
  handleCredentialResponse,
  parseCredentialResponse,
  decodeJwtToken,
  generateSessionId,
  validateTableStructure,
  validateTableAccessibility,
  validateLandmark,
  validateLandmarkStructure,
  createInPageButton,
  personName,
  handleInitialAccessibility,
  ensureInteractiveElementsAccessible,
  addressAccessibilityIssues,
  renderDependencyGraphs,
  checkLandmarkElements
};