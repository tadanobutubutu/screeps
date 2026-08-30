// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute to HTML element  (handled by getLangAttribute() and personName())
// REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// REACT_036: Fix 1 fake link issue (handled by ... [PERSON_NAME](), ... and personName())
// ADD: Address new accessibility issues from insight report

const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

// ... (existing code, exports, and functions)

// New functions for accessibility and dependency graphs

/**
 * Adds an aria-label attribute to the given element.
 * @param {Element} element - The DOM element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {Element} The element with the aria-label added
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (typeof label !== 'string' || label.trim() === '') {
    throw new Error('Aria label must be a non-empty string');
  }

  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Ensures that the given element has an id attribute.
 * If the element doesn't have an id, generates and assigns a unique one.
 * @param {Element} element - The DOM element to check
 * @param {string} [prefix='element'] - Optional prefix for the generated id
 * @returns {string} The id of the element
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const uniqueId = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = uniqueId;
  return uniqueId;
}

/**
 * Renders a dependency graph visualization.
 * @param {Object} dependencies - Object containing dependency data
 * @param {string} containerId - The id of the container element to render into
 * @returns {HTMLElement} The rendered graph element
 */
function renderDependencyGraph(dependencies, containerId) {
  if (!dependencies || typeof dependencies !== 'object') {
    throw new Error('Dependencies must be a valid object');
  }

  if (!containerId || typeof containerId !== 'string') {
    throw new Error('Container id must be a non-empty string');
  }

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container element with id "${containerId}" not found`);
  }

  // Create the graph container
  const graphContainer = document.createElement('div');
  graphContainer.className = 'dependency-graph';
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', 'Dependency graph visualization');

  // Build the graph structure from dependencies
  const nodes = [];
  const edges = [];

  for (const [key, value] of Object.entries(dependencies)) {
    const nodeId = ensureElementHasId({ id: '' }, key);
    nodes.push({
      id: key,
      name: key,
      dependencies: Array.isArray(value) ? value : []
    });

    if (Array.isArray(value)) {
      value.forEach(dep => {
        edges.push({
          source: dep,
          target: key
        });
      });
    }
  }

  // Create a simple text representation of the graph
  const graphElement = document.createElement('div');
  graphElement.className = 'dependency-graph-content';

  // Add nodes section
  const nodesSection = document.createElement('div');
  nodesSection.className = 'graph-nodes';
  nodesSection.innerHTML = '<h4>Nodes:</h4><ul>' + nodes.map(node => `<li>${node.name}</li>`).join('') + '</ul>';

  // Add edges section
  const edgesSection = document.createElement('div');
  edgesSection.className = 'graph-edges';
  edgesSection.innerHTML = '<h4>Dependencies:</h4><ul>' + edges.map(edge => `<li>${edge.source} → ${edge.target}</li>`).join('') + '</ul>';

  graphElement.appendChild(nodesSection);
  graphElement.appendChild(edgesSection);
  graphContainer.appendChild(graphElement);

  // Clear container and append the graph
  container.innerHTML = '';
  container.appendChild(graphContainer);

  return graphContainer;
}

// TODO: Implement function for addressing accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  // Implementation of the function to address accessibility issues
  // This processes the insight report and takes appropriate actions to fix issues

  // Support both insightReport.issues and insightReport.accessibilityIssues
  const issues = insightReport?.issues?.length ? insightReport.issues : insightReport?.accessibilityIssues;
  if (!issues || !Array.isArray(issues)) {
    console.log('No valid accessibility issues found in the insight report');
    return [];
  }

  const addressedIssues = [];

  issues.forEach((issue, index) => {
    console.log(`Addressing accessibility issue ${issue.code}: ${issue.message}`);

    let actionTaken = false;

    switch (issue.code) {
      case 'REACT_015':
        // Add lang attribute to HTML element
        try {
          addLangAttribute(document.documentElement);
          actionTaken = true;
          console.log('Added language attribute to HTML element');
        } catch (error) {
          console.error('Failed to add language attribute:', error);
        }
        break;

      case 'REACT_027':
        // Fix table structure issues
        try {
          fixTableStructure();
          actionTaken = true;
          console.log('Fixed table structure issues');
        } catch (error) {
          console.error('Failed to fix table structure:', error);
        }
        break;

      case 'REACT_017':
      case 'REACT_025':
        // Add/fix landmark issues
        try {
          addMainLandmark();
          ensureUniqueLandmarks();
          actionTaken = true;
          console.log('Added and ensured unique landmarks');
        } catch (error) {
          console.error('Failed to fix landmark issues:', error);
        }
        break;

      case 'REACT_041':
        // Add accessible names to SVGs
        try {
          const svgElements = document.querySelectorAll('svg');
          svgElements.forEach(svg => {
            if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('role')) {
              const accessibleName = getSvgAccessibleName(svg);
              if (accessibleName) {
                setSvgAttributes(svg, accessibleName);
              }
            }
          });
          actionTaken = true;
          console.log('Added accessible names to SVGs');
        } catch (error) {
          console.error('Failed to add SVG accessible names:', error);
        }
        break;

      case 'REACT_036':
        // Fix fake link issues
        try {
          handleFakeLinks();
          actionTaken = true;
          console.log('Fixed fake link issues');
        } catch (error) {
          console.error('Failed to fix fake link issues:', error);
        }
        break;
      default:
        console.log(`No specific handler for issue code: ${issue.code}`);
        break;
    }

    addressedIssues.push({
      issue,
      actionTaken,
      timestamp: new Date().toISOString()
    });
  });

  console.log(`Addressed ${addressedIssues.length} accessibility issues`);
  return addressedIssues;
}

module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum,
  createInPageButton,
  Landmark,
  React,
  ReactDOM,
  initializeApp,
  appData,
  registerSW,
  appStarted,
  renderDependencyGraph,
  addressAccessibilityIssues
};