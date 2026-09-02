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
  const dependencyGraphContainer = document.querySelector('[data-dependency-graph]') || document.getElementById('dependency-graph');
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
function landmarkStructureCheck(landmark) {
  const requiredRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const errors = [];
  
  if (!landmark || typeof landmark !== 'object') {
    errors.push('Landmark must be an object');
    return { valid: false, errors };
  }
  
  if (!landmark.role || !requiredRoles.includes(landmark.role)) {
    errors.push('Landmark must have a valid ARIA role');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Set language attribute on HTML element
function setLanguageAttribute(lang) {
  const htmlElement = document.documentElement;
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
    return true;
  }
  return false;
}

// Add landmark roles to elements
function addLandmarkRoles() {
  const mainElement = document.querySelector('main') || document.getElementById('main-content');
  const navElement = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  const footerElement = document.querySelector('footer') || document.querySelector('[role="contentinfo"]');
  
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }
  if (footerElement && !footerElement.getAttribute('role')) {
    footerElement.setAttribute('role', 'contentinfo');
  }
}

// Fix fake links to have proper button behavior
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"], a[href="#"], .fake-link');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
    if (link.getAttribute('href') === '#') {
      link.setAttribute('href', 'javascript:void(0)');
    }
  });
}

// Check if running in secure context
function isSecureContext() {
  return window.isSecureContext === true || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

// Ensure focusable elements are accessible
function ensureFocusableElements() {
  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusableElements = document.querySelectorAll(focusableSelectors);
  
  focusableElements.forEach(element => {
    if (!element.getAttribute('tabindex') && element.matches('a, button, input')) {
      // Element is naturally focusable, no action needed
    } else if (element.getAttribute('tabindex') === '0') {
      element.setAttribute('tabindex', '0');
    }
  });
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (!elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// Process unique elements
function processUniqueElements(elements) {
  if (!Array.isArray(elements)) {
    return elements;
  }
  
  const seen = new Set();
  return elements.filter(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Render dependency graph function
function renderDependencyGraph(container) {
  if (!container) return;
  
  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'img');
  graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
  graphContainer.id = 'dependency-graph-visualization';
  
  container.appendChild(graphContainer);
}

// Render index view function
function renderIndexView(container) {
  if (!container) return;
  
  const indexContainer = document.createElement('div');
  indexContainer.setAttribute('role', 'navigation');
  indexContainer.setAttribute('aria-label', 'Index navigation');
  indexContainer.id = 'index-view';
  
  container.appendChild(indexContainer);
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.querySelector('.dependency-graph-container') || document.getElementById('dependency-graph');
  if (!container) {
    return;
  }

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// Calculate sum function
function calculateSum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return NaN;
  }
  return a + b;
}

// Add proper landmark regions
function addProperLandmarkRegions() {
  const regions = document.querySelectorAll('section, aside, div[id]');
  regions.forEach(region => {
    if (!region.getAttribute('role') && !region.tagName.match(/^(header|footer|nav|main|aside)$/i)) {
      region.setAttribute('role', 'region');
      if (!region.getAttribute('aria-label')) {
        region.setAttribute('aria-label', 'Section content');
      }
    }
  });
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper caption if needed
    if (!table.querySelector('caption') && table.rows && table.rows.length > 0) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      // Add headers if missing
      const firstRow = table.rows[0];
      if (firstRow) {
        Array.from(firstRow.cells).forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          cell.replaceWith(th);
        });
      }
    }

    // Ensure table has proper