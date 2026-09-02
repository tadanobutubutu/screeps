import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
function addressInsightIssues() {
  const dependencyGraphContainer = document.querySelector('[data-dependency-graph]');
  if (dependencyGraphContainer) {
    dependencyGraphContainer.setAttribute('role', 'region');
    dependencyGraphContainer.setAttribute('aria-label', 'Dependency Graph Visualization');
  }
}

// Implemented validateLandmark functionality
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

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return [];
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// Landmark structure check function
function landmarkStructureCheck() {
  const requiredLandmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary'];
  const existingLandmarks = Array.from(document.querySelectorAll('[role]'));
  
  const missing = requiredLandmarks.filter(role => {
    return !existingLandmarks.some(el => el.getAttribute('role') === role);
  });
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// Set language attribute function
function setLanguageAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
    return true;
  }
  return false;
}

// Add landmark roles to elements
function addLandmarkRoles() {
  const landmarkSelectors = {
    'nav': 'navigation',
    'main': 'main',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'section': 'region'
  };
  
  const results = [];
  Object.entries(landmarkSelectors).forEach(([selector, role]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.getAttribute('role')) {
        el.setAttribute('role', role);
        results.push({ element: selector, role });
      }
    });
  });
  
  return results;
}

// Fix fake links function
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  const results = [];
  
  fakeLinks.forEach(link => {
    if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
      link.setAttribute('tabindex', '0');
      link.setAttribute('role', 'button');
      results.push(link);
    }
  });
  
  return results;
}

// Check if running in secure context
function isSecureContext() {
  return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

// Ensure focusable elements have proper attributes
function ensureFocusableElements() {
  const focusableSelectors = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = document.querySelectorAll(focusableSelectors);
  
  const results = [];
  focusableElements.forEach(el => {
    if (!el.hasAttribute('tabindex') || el.getAttribute('tabindex') === '0') {
      results.push(el);
    }
  });
  
  return results;
}

// Validate SVG accessibility
function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  const issues = [];
  
  svgs.forEach(svg => {
    const hasTitle = svg.querySelector('title') !== null;
    const hasDesc = svg.querySelector('desc') !== null;
    const hasRole = svg.getAttribute('role') !== null;
    
    if (!hasTitle && !hasDesc) {
      issues.push({ svg, issue: 'missing title or description' });
    }
    
    if (!hasRole) {
      issues.push({ svg, issue: 'missing role attribute' });
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// Process unique elements
function processUniqueElements(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }
  
  const seen = new Map();
  return elements.filter(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (seen.has(key)) {
      return false;
    }
    seen.set(key, true);
    return true;
  });
}

// Render dependency graph function
function renderDependencyGraph(container) {
  const graphElement = document.createElement('div');
  graphElement.setAttribute('role', 'img');
  graphElement.setAttribute('aria-label', 'Dependency graph visualization');
  graphElement.className = 'dependency-graph';
  
  const title = document.createElement('h2');
  title.textContent = 'Dependencies';
  graphElement.appendChild(title);
  
  container.appendChild(graphElement);
  return graphElement;
}

// Render index view function
function renderIndexView(container) {
  const indexElement = document.createElement('div');
  indexElement.className = 'index-view';
  indexElement.setAttribute('role', 'navigation');
  indexElement.setAttribute('aria-label', 'Index navigation');
  
  const list = document.createElement('ul');
  const items = ['Home', 'About', 'Contact'];
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  
  indexElement.appendChild(list);
  container.appendChild(indexElement);
  return indexElement;
}

// Calculate sum function
function calculateSum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return 0;
  }
  return a + b;
}

// Add proper landmark regions
function addProperLandmarkRegions() {
  const regions = document.querySelectorAll('section');
  const results = [];
  
  regions.forEach(region => {
    if (!region.id) {
      const id = 'region-' + Math.random().toString(36).substr(2, 9);
      region.id = id;
    }
    if (!region.getAttribute('role')) {
      region.setAttribute('role', 'region');
    }
    results.push(region);
  });
  
  return results;
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

// Updated