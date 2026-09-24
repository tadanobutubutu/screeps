// TODO: Identify and update specific functions that render dependency graphs or
// index views.

import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { createAccessibleButton } from './accessibility.js'; // Import the new function

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

    // Example implementation (would be replaced with actual visualization code)
    container.innerHTML = `
        <div class="dependency-graph">
            <h3>Dependency Graph</h3>
            <pre>${JSON.stringify(dependencies, null, 2)}</pre>
        </div>
    `;
}

/**
 * Renders an index view of dependencies
 * @param {Object} indexData - The index data to display
 * @param {string} containerId - The ID of the container element
 */
function renderDependencyIndex(indexData, containerId) {
    // Implementation for rendering dependency index
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container element with ID ${containerId} not found`);
        return;
    }

    // Example implementation (would be replaced with actual index view code)
    container.innerHTML = `
        <div class="dependency-index">
            <h3>Dependency Index</h3>
            <ul>
                ${Object.keys(indexData).map(key => `
                    <li>
                        <strong>${key}:</strong> ${indexData[key]}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

// ... (previous and updated code remains as it is)

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          elementsById[landmark.id] = true;
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

/**
 * Adds accessibility properties to SVG elements
 * @param {SVGElement} svgElement - The SVG element to enhance
 * @param {Object} options - Configuration options
 * @param {string} [options.title] - Accessible title for the SVG
 * @param {string} [options.desc] - Accessible description for the SVG
 * @param {string} [options.role] - ARIA role for the SVG (default: 'img')
 * @returns {SVGElement} The enhanced SVG element
 */
function addSvgAccessibilityProps(svgElement, options = {}) {
  if (!svgElement || !(svgElement instanceof SVGElement)) {
    console.warn('Invalid SVG element provided');
    return svgElement;
  }

  // Set ARIA role if not already set
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', options.role || 'img');
  }

  // Add title element if provided
  if (options.title) {
    let titleElement = svgElement.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      svgElement.prepend(titleElement);
    }
    titleElement.textContent = options.title;
  }

  // Add description element if provided
  if (options.desc) {
    let descElement = svgElement.querySelector('desc');
    if (!descElement) {
      descElement = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
      svgElement.appendChild(descElement);
    }
    descElement.textContent = options.desc;
  }

  // Ensure SVG has proper dimensions if not set
  if (!svgElement.getAttribute('width') || !svgElement.getAttribute('height')) {
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');
  }

  // Add focusability if needed
  if (options.focusable !== false) {
    svgElement.setAttribute('focusable', 'true');
    svgElement.setAttribute('tabindex', '0');
  }

  return svgElement;
}

// Export functions for testing
export {
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  initApp,
  landmarks,
  appData,
  icons,
  validateLandmark,
  ensureFocusableElements,
  renderDependencyGraphContent,
  ensureLandmarkUniqueness,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  countDependencies,
  addSvgAccessibilityProps
};