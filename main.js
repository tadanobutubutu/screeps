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
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

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
  } else if (typeof landmark.longitude !== 'number' || ... {
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
  const element = ...
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
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
function landmarkStructureCheck(element) {
  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }
  const errors = [];
  // Basic structure validation
  if (typeof element !== 'object') {
    errors.push('Element must be an object');
  }
  return { valid: errors.length === 0, errors };
}

// Set language attribute on document
function setLanguageAttribute(lang) {
  if (document && lang) {
    document.documentElement.lang = lang;
    return true;
  }
  return false;
}

// Add landmark roles to elements
function addLandmarkRoles(container) {
  const landmarkSelectors = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];
  const elements = container ? container.querySelectorAll(landmarkSelectors.join(',')) : document.querySelectorAll(landmarkSelectors.join(','));
  
  elements.forEach(el => {
    if (!el.getAttribute('role')) {
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'main') el.setAttribute('role', 'main');
      else if (tagName === 'nav') el.setAttribute('role', 'navigation');
      else if (tagName === 'aside') el.setAttribute('role', 'complementary');
    }
  });
  
  return elements.length;
}

// Fix fake links (anchor tags without href)
function fixFakeLinks(container) {
  const links = container ? container.querySelectorAll('a:not([href])') : document.querySelectorAll('a:not([href])');
  let fixedCount = 0;
  
  links.forEach(link => {
    if (link.getAttribute('onclick') || link.dataset.action) {
      link.setAttribute('role', 'button');
      fixedCount++;
    }
  });
  
  return fixedCount;
}

// Check if running in secure context
function isSecureContext() {
  return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

// Initialize the application
function initApp() {
  initializeApp();
  registerSW();
  return true;
}

// Ensure focusable elements have proper tabindex
function ensureFocusableElements(container) {
  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
  const elements = container ? container.querySelectorAll(focusableSelectors) : document.querySelectorAll(focusableSelectors);
  let fixedCount = 0;
  
  elements.forEach(el => {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
      fixedCount++;
    }
  });
  
  return fixedCount;
}

// Render dependency graph content
function renderDependencyGraphContent(data) {
  const container = document.getElementById('dependencyGraph');
  if (!container) return false;
  
  // Ensure proper ARIA role
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', 'Dependency graph visualization');
  
  if (data && typeof data === 'object') {
    container.innerHTML = JSON.stringify(data, null, 2);
    return true;
  }
  
  return false;
}

// Validate SVG accessibility
function validateSvgAccessibility(svgElement) {
  const errors = [];
  
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    errors.push('Valid SVG element is required');
    return { valid: false, errors };
  }
  
  // Check for title
  const title = svgElement.querySelector('title');
  if (!title) {
    errors.push('SVG should have a title element');
  }
  
  // Check for desc
  const desc = svgElement.querySelector('desc');
  if (!desc) {
    errors.push('SVG should have a desc element for accessibility');
  }
  
  // Check for ARIA attributes
  if (!svgElement.getAttribute('role') && !svgElement.getAttribute('aria-label')) {
    errors.push('SVG should have role or aria-label');
  }
  
  return { valid: errors.length === 0, errors };
}

// Process unique elements
function processUniqueElements(elements) {
  if (!Array.isArray(elements)) {
    return { unique: [], duplicates: 0 };
  }
  
  const seen = new Set();
  const unique = [];
  let duplicates = 0;
  
  elements.forEach(el => {
    const key = JSON.stringify(el);
    if (seen.has(key)) {
      duplicates++;
    } else {
      seen.add(key);
      unique.push(el);
    }
  });
  
  return { unique, duplicates };
}

// Address insight issues
function addressInsightIssues() {
  const issues = [];
  
  // Check dependencyGraph container
  const depGraph = document.getElementById('dependencyGraph');
  if (depGraph && !depGraph.getAttribute('role')) {
    depGraph.setAttribute('role', 'img');
    depGraph.setAttribute('aria-label', 'Dependency graph visualization');
    issues.push('Fixed dependencyGraph ARIA role');
  }
  
  return issues;
}

// Render dependency graph
function renderDependencyGraph(dependencies) {
  const container = document.getElementById('dependencyGraph');
  if (!container) return false;
  
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', 'Dependency graph');
  
  if (Array.isArray(dependencies)) {
    const list = document.createElement('ul');
    dependencies.forEach(dep => {
      const item = document.createElement('li');
      item.textContent = dep.name || dep;
      list.appendChild(item);
    });
    container.appendChild(list);
    return true;
  }
  
  return false;
}

// Render index view
function renderIndexView(data) {
  const container = document.getElementById('indexView');
  if (!container) return false;
  
  container.innerHTML = '';
  
  if (data && Array.isArray(data)) {
    const list = document.createElement('ul');
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name || item;
      list.appendChild(li);
    });
    container.appendChild(list);
    return true;
  }
  
  return false;
}

// Calculate sum utility function
function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    return 0;
  }
  return numbers.reduce((sum, num) => sum + (typeof num === 'number' ? num : 0), 0);
}

// Add proper landmark regions
function addProperLandmarkRegions(container) {
  const regions = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  let count = 0;
  
  regions.forEach(role => {
    const elements = (container || document).querySelectorAll(`[role="${role}"]`);
    elements.forEach(el => {
      if (!el.id) {
        el.id = `${role}-region-${count}`;
      }
      count++;