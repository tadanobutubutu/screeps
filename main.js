// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};
let uniqueLandmarks = {};

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

// TODO: This is the new function request
function newFunction() {
  // Implement the new function here
  console.log("New Function has been called!");
}

// Continue with existing exports, functions, or any other code that follows

// Function to ensure an element has an id
function ensureElementHasId(element) {
  if (!element.id) {
    const generatedId = 'el-' + Math.random().toString(36).substr(2, 9);
    element.setAttribute('id', generatedId);
  }
  return element.id;
}

// Function to add aria-label to an element
function addAriaLabel(element, label) {
  if (label && !element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

// Function to render a dependency graph
function renderDependencyGraph(container, dependencies) {
  const graphContainer = document.querySelector(container);
  if (graphContainer) {
    graphContainer.innerHTML = '';
    const ul = document.createElement('ul');
    dependencies.forEach(dep => {
      const li = document.createElement('li');
      li.textContent = dep.name;
      ul.appendChild(li);
    });
    graphContainer.appendChild(ul);
  }
}