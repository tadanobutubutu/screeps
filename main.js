function enhanceSvgAccessibility(input, options = {}) {
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    // Props-based configuration (for React components)
    if (input instanceof SVGElement || (input.props !== undefined)) {
      // Direct DOM manipulation
      return enhanceSvgElement(input, options);
    }
    // Plain props object
    const enhancedProps = { ...input };

    // Set default role if not present
    if (!enhancedProps.role) {
      enhancedProps.role = 'img';
    }

    // Add aria-label if provided
    if (options.ariaLabel && !enhancedProps['aria-label']) {
      enhancedProps['aria-label'] = options.ariaLabel;
    }

    // Add aria-hidden if provided
    if (options.ariaHidden !== undefined && enhancedProps['aria-hidden'] === undefined) {
      enhancedProps['aria-hidden'] = options.ariaHidden;
    }

    // Ensure focusable attribute is set correctly
    if (enhancedProps.focusable === undefined) {
      enhancedProps.focusable = 'false';
    }

    return enhancedProps;
  } else if (input && typeof input === 'object' && input.tagName === 'SVG') {
    // Direct DOM manipulation
    return enhanceSvgElement(input, options);
  }

  return null;
}

function enhanceSvgElement(svgElement, { title, desc, focusable = false }) {
  if (!svgElement || !(svgElement instanceof SVGElement)) {
    throw new Error('Invalid SVG element provided');
  }

  // Add ARIA role if not present
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }

  // Add title element if not already present
  if (title && !svgElement.querySelector('title')) {
    const titleElement = document.createElement('title');
    titleElement.textContent = title;
    svgElement.insertBefore(titleElement, svgElement.firstChild);
  }

  // Add description if provided
  if (desc && !svgElement.querySelector('desc')) {
    const descElement = document.createElement('desc');
    descElement.textContent = desc;
    svgElement.insertBefore(descElement, svgElement.firstChild);
  }

  // Set focusability
  svgElement.setAttribute('focusable', focusable ? 'true' : 'false');

  return svgElement;
}

// User Safety: unsafe
// Safety Categories: Unauthorized Advice
const appData = {
  title: 'Screeps',
  version: '1.0.0'
};
const books = [];
const safetyCategory = "User Safety: unsafe";
const safetyCategories = ["Unauthorized Advice"];
const utils = require('./utils');

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  name: 'ScreepsBot',
  version: '1.0.0',
  debug: true,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  landmarkRoles: undefined,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50
};

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

let isInitialized = false;
const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const { getLangAttribute, addLangAttribute } = require('./utils');
const validateTableStructure = utils.validateTableStructure;

function validateLandmark(landmark) {
  if (landmark && landmark.nodeType === Node.ELEMENT_NODE) {
    const issues = [];
    if (!landmark.tagName) {
      issues.push('Missing tagName');
    } else {
      const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
      if (!validLandmarks.includes(landmark.tagName.toLowerCase())) {
        issues.push(`Invalid landmark: ${landmark.tagName}`);
      }
    }
    if (landmark.getAttribute('role')) {
      const validRoles = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];
      const role = landmark.getAttribute('role');
      if (!validRoles.includes(role)) {
        issues.push('Invalid landmark role');
      }
    }
    if (issues.length > 0) {
      setLandmarkAttributes(landmark, getLangAttribute(), issues);
    }
    return {
      success: issues.length === 0,
      issues
    };
  }
  return {
    success: false,
    issues: ['Invalid landmark: The provided argument is not a valid HTML element or null']
  };
}

function setLandmarkAttributes(landmark, lang, issues) {
  if (issues.length > 0) {
    landmark.setAttribute('role', 'landmark');
    if (lang) landmark.setAttribute('lang', lang);
  }
  return landmark;
}

function countDependencies() {
  let external = null;
  let error = null;
  if (typeof require === 'function') {
    try {
      const packageJson = require('./package.json');
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};
      const peerDependencies = packageJson.peerDependencies || {};
      const optionalDependencies = packageJson.optionalDependencies || {};

      external = {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        peerDependencies: Object.keys(peerDependencies).length,
        optionalDependencies: Object.keys(optionalDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length + Object.keys(peerDependencies).length + Object.keys(optionalDependencies).length
      };
    } catch (err) {
      error = err.message;
    }
  }

  if (error) {
    return {
      internalCount: 0,
      external,
      error
    };
  } else {
    return {
      internalCount: 0,
      external
    };
  }
}

function ensureUniqueLandmarks(landmarksArg) {
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarks)) {
    for (let i = 0; i < landmarks.length; i++) {
      const landmark = landmarks[i];
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  const landmarksByRole = {};
  const allLandmarks = document.querySelectorAll('[role]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        console.warn('Duplicate landmark role: ' + role);
      } else {
        landmarksByRole[role] = true;
      }
    }
  });

  return {
    success: true,
    duplicates: []
  };
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) {
      console.warn('Table missing caption');
      return false;
  }
  return validateTableStructure(tableElement);
}

function validateTableCellsScope(tableElement) {
  const cells = tableElement.querySelectorAll('th, td');
  if (cells.length > 0) {
    cells.forEach((cell, index) => {
      const scope = cell.getAttribute('scope');
      if (scope !== null && `${index}` !== scope) {
        console.warn(`Cell at index ${index} has incorrect scope: ${scope}`);
      }
    });
  }
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role]');
  let hasMain = false;
  let hasNavigation = false;

  landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
  });

  if (!hasMain) console.warn('Missing main landmark');
  if (!hasNavigation) console.warn('Missing navigation landmark');

  return hasMain && hasNavigation;
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

/**
 * Render a dependency graph from the provided data structure
 * @param {Object} data - The dependency data to visualize
 * @returns {HTMLElement} The rendered dependency graph element
 */
function renderDependencyGraph(data) {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data provided for dependency graph rendering');
    return null;
  }

  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'region');
  graphContainer.setAttribute('aria-label', 'Dependency Graph');
  graphContainer.className = 'dependency-graph';
  
  return graphContainer;
}

/**
 * Render an index view for the provided data
 * @param {Object} data - The data to display in the index view
 * @returns {HTMLElement} The rendered index view element
 */
function renderIndexView(data) {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data provided for index view rendering');
    return null;
  }

  const indexContainer = document.createElement('div');
  indexContainer.setAttribute('role', 'region');
  indexContainer.setAttribute('aria-label', 'Index View');
  indexContainer.className = 'index-view';
  
  return indexContainer;
}

module.exports = {
    config,
    appState,
    validateLandmark,
    countDependencies,
    ensureUniqueLandmarks,
    validateTableAccessibility,
    validateTableCellsScope,
    validateLandmarkStructure,
    addLandmarkRegions,
    formatDate,
    renderDependencyGraph,
    renderIndexView,
    getLangAttribute,
    addLangAttribute,
    validateTableStructure
};