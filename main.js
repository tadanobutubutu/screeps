// main.js

// Find the primary content element in the DOM
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && !primaryContent.closest('main')) {
    // Create a new <main> element
    const mainElement = document.createElement('main');

    // Insert the <main> element before the primary content in the DOM
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);

    // Move the primary content inside the <main> element
    mainElement.appendChild(primaryContent);

    return mainElement;
}

// Landmark configuration
const express = require('express');
const books = [];
const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  requiredLandmarks: ['banner', 'navigation', 'main']
};

const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

// Load landmarks from file
function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
      console.error('Error loading landmarks:', error.message);
      return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
}

// Accessibility utilities
function enhanceAccessibilityForAddBook(form) {
  if (!form) return;
  
  // Ensure form has proper accessibility attributes
  if (!form.getAttribute('role')) {
    form.setAttribute('role', 'form');
  }
  
  // Get all input fields in the form
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    // Ensure each input has an aria-label or associated label
    const id = input.id || input.getAttribute('name');
    if (!input.getAttribute('aria-label') && !form.querySelector(`label[for="${id}"]`)) {
      const label = form.querySelector(`label[for="${input.id}"]`) || form.querySelector(`label[for="${input.name}"]`);
      if (!label) {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    }
    
    // Ensure required fields have proper ARIA attributes
    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });
  
  // Get the submit button
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton && !submitButton.getAttribute('aria-label') && !submitButton.textContent.trim()) {
    submitButton.setAttribute('aria-label', 'Submit form');
  }
  
  return form;
}

// Add landmark regions
function addLandmarkRegions(container) {
  if (!container) return [];
  
  const regions = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
  const addedRegions = [];
  
  regions.forEach(role => {
    const existing = container.querySelector(`[role="${role}"]`);
    if (!existing) {
      const region = document.createElement('div');
      region.setAttribute('role', role);
      container.appendChild(region);
      addedRegions.push(role);
    }
  });
  
  return addedRegions;
}

// Process accessibility issues
function processAccessibilityIssues(document) {
  const issues = [];
  
  // Check for lang attribute
  if (!document.documentElement.lang) {
    issues.push('Missing lang attribute on html element');
  }
  
  // Check for main landmark
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!main) {
    issues.push('Missing main landmark');
  }
  
  // Check SVGs for accessible names
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const hasAccessibleName = svg.getAttribute('aria-label') || 
                             svg.getAttribute('aria-labelledby') || 
                             svg.querySelector('title');
    if (!hasAccessibleName) {
      issues.push(`SVG at index ${index} missing accessible name`);
    }
  });
  
  return issues;
}

// Validate landmark attributes
function validateLandmarkAttributes(container) {
  const errors = [];
  
  if (!container) {
    errors.push('Container is required');
    return { valid: false, errors };
  }
  
  const landmarks = container.querySelectorAll('[role]');
  const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form', 'region'];
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!validRoles.includes(role)) {
      errors.push(`Invalid landmark role: ${role}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate landmark structure
function landmarkStructureCheck(container) {
  if (!container) return { valid: false, errors: ['Container is required'] };
  const landmarks = container.querySelectorAll('[role]');
  const errors = [];
  landmarks.forEach(lm => {
    const role = lm.getAttribute('role');
    if (!['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form'].includes(role)) {
      errors.push(`Invalid landmark role: ${role}`);
    }
  });
  return { valid: errors.length === 0, errors };
}

// Set language attribute
function setLanguageAttribute(element, lang) {
  if (element && typeof lang === 'string' && lang.length > 0) {
    element.setAttribute('lang', lang);
    return true;
  }
  return false;
}

// Add landmark roles to elements
function addLandmarkRoles(elements) {
  if (!Array.isArray(elements)) return [];
  return elements.map(el => {
    if (el.tagName) {
      const tag = el.tagName.toLowerCase();
      const roleMap = { nav: 'navigation', main: 'main', footer: 'contentinfo', aside: 'complementary' };
      if (roleMap[tag] && !el.getAttribute('role')) {
        el.setAttribute('role', roleMap[tag]);
      }
    }
    return el;
  });
}

// Fix fake links function with array support
function fixFakeLinksWithArray(links) {
  if (!Array.isArray(links)) return [];
  return links.map(link => {
    if (link.href && !link.getAttribute('role')) {
      if (link.href.startsWith('#') || link.href === '') {
        link.setAttribute('role', 'button');
      }
    }
    return link;
  });
}

// Secure context check
function isSecureContextCheck() {
  return window.isSecureContext === true || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

// Visualize Dependency Tree - creates a dependency visualization
function VisualizeDependencyTree(container, dependencies) {
  if (!container || !Array.isArray(dependencies)) return null;
  
  const wrapper = document.createElement('div');
  wrapper.setAttribute('class', 'dependency-tree-container');
  wrapper.setAttribute('role', 'tree');
  wrapper.setAttribute('aria-label', 'Dependency tree visualization');
  
  dependencies.forEach(dep => {
    const node = document.createElement('div');
    node.setAttribute('role', 'treeitem');
    node.setAttribute('tabindex', '0');
    node.textContent = dep.name || dep;
    wrapper.appendChild(node);
  });
  
  container.appendChild(wrapper);
  return wrapper;
}

// Render Dependency Graph Content
function renderDependencyGraphContent(container, graphData) {
  if (!container || !graphData) return null;
  
  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('class', 'dependency-graph');
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', graphData.title || 'Dependency graph');
  
  if (graphData.nodes && Array.isArray(graphData.nodes)) {
    graphData.nodes.forEach(node => {
      const nodeElement = document.createElement('div');
      nodeElement.setAttribute('class', 'graph-node');
      nodeElement.setAttribute('data-id', node.id || '');
      nodeElement.textContent = node.label || node.id || '';
      graphContainer.appendChild(nodeElement);
    });
  }
  
  container.appendChild(graphContainer);
  return graphContainer;
}

// Ensure Dependency Graph ARIA Role
function ensureDependencyGraphAriaRole(container) {
  if (!container) return false;
  
  const graphElements = container.querySelectorAll('.dependency-graph, .dependency-tree-container');
  let allValid = true;
  
  graphElements.forEach(graph => {
    if (!graph.getAttribute('role')) {
      graph.setAttribute('role', 'img');
      allValid = false;
    }
    if (!graph.getAttribute('aria-label') && !graph.querySelector('title')) {
      graph.setAttribute('aria-label', 'Dependency graph');
      allValid = false;
    }
  });
  
  return allValid;
}

// Render Dependency Graph - main function to render dependency graphs
function renderDependencyGraph(container, options) {
  if (!container) return null;
  
  const defaultOptions = {
    title: 'Dependency Graph',
    interactive: true,
    showLabels: true
  };
  
  const config = { ...defaultOptions, ...options };
  
  const graphWrapper = document.createElement('div');
  graphWrapper.setAttribute('class', 'dependency-graph-wrapper');
  graphWrapper.setAttribute('role', 'application');
  graphWrapper.setAttribute('aria-label', config.title);
  
  const title = document.createElement('h3');
  title.textContent = config.title;
  graphWrapper.appendChild(title);
  
  const graphCanvas = document.createElement('div');
  graphCanvas.setAttribute('class', 'graph-canvas');
  graphWrapper.appendChild(graphCanvas);
  
  container.appendChild(graphWrapper);
  return graphWrapper;
}

// Main component (rewritten without JSX)
function MainComponent() {
  const sorting = 'sortByTitle';
  const getBooksList = [];

  // Create the main container
  const container = document.createElement