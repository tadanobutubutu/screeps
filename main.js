const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark element is required');
    return errors;
  }

  // Get the role of the landmark
  const role = landmark.role || (landmark.getAttribute ? landmark.getAttribute('role') : null);

  // Define valid landmark roles according to ARIA spec
  const validLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];

  // Validate role attribute exists
  if (!role) {
    errors.push('Landmark must have a role attribute');
  } else if (validLandmarks.indexOf(role) === -1) {
    // Check if it's a valid landmark role
    const validRoles = ['application', 'form', 'region'];
    if (validRoles.indexOf(role) === -1) {
      errors.push(`Invalid landmark role: ${role}`);
    }
  }

  // Additional validation for specific landmarks
  if (role === 'main') {
    // There should only be one main landmark per page
    const existingMain = document.querySelector('[role="main"]');
    if (existingMain && existingMain !== landmark) {
      errors.push('Duplicate main landmark found');
    }
  }

  // Check for accessible name on landmarks that require it
  const landmarksRequiringName = ['search', 'navigation', 'complementary'];
  if (landmarksRequiringName.indexOf(role) !== -1) {
    const hasLabel = landmark.getAttribute ? 
      (landmark.getAttribute('aria-label') || 
       landmark.getAttribute('aria-labelledby') ||
       landmark.getAttribute('aria-description')) : false;
    if (!hasLabel) {
      errors.push(`Landmark with role "${role}" should have an accessible name`);
    }
  }

  // Validate role against allowed roles in config
  if (role && config.allowedRoles.indexOf(role) === -1) {
    errors.push('Invalid landmark role');
  }

  return errors;
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

const HTML = ({ lang }) => <html lang={lang}>{/* other children */}</html>;

function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    return document.documentElement.lang || navigator.language || 'en-US';
}

function validateTableAccessibility(tableElement) {
    if (!tableElement || !tableElement.querySelector) {
        console.warn('Table missing caption');
        return false;
    }
    const caption = tableElement.querySelector('caption');
    if (!caption) {
        console.warn('Table missing caption');
        return false;
    }
    return true;
}

function validateTableStructure(tableElement) {
    const rows = tableElement ? tableElement.querySelectorAll('tr') : [];
    if (rows.length === 0) {
        console.warn('Table has no rows');
        return false;
    }
    return true;
}

function validateLandmarkStructure() {
    const landmarks = document ? document.querySelectorAll('[role]') : [];
    let hasMain = false;
    let hasNavigation = false;

    landmarks.forEach(landmark => {
        const role = landmark.getAttribute ? landmark.getAttribute('role') : null;
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

function getSvgAccessibleName(svgElement) {
    const svgEl = svgElement || (document ? document.querySelector('svg') : null);
    const title = svgEl ? svgEl.querySelector('title') : null;
    const ariaLabel = svgEl ? svgEl.getAttribute('aria-label') : null;
    if (title) return title.textContent;
    if (ariaLabel) return ariaLabel;
    return 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
  return svg;
}

function ensureUniqueLandmarks(landmarksArg) {
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarks)) {
    for (const landmark of landmarks) {
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
  const allLandmarks = document ? document.querySelectorAll('[role]') : [];

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute ? landmark.getAttribute('role') : null;
    if (landmarksByRole[role]) {
      console.warn(`Duplicate landmark role: ${role}`);
    } else {
      landmarksByRole[role] = true;
    }
  });

  return landmarks;
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

function handleAccessibilityIssues() {
    const tables = document ? document.querySelectorAll('table') : [];
    tables.forEach(table => {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });

    const landmarks = document ? document.querySelectorAll('[role]') : [];
    landmarks.forEach(landmark => {
        validateLandmark(landmark);
    });

    validateLandmarkStructure();
    ensureUniqueLandmarks();

    const svgs = document ? document.querySelectorAll('svg') : [];
    svgs.forEach(svg => {
        getSvgAccessibleName(svg);
    });
}

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'aside:not([role])',
  'section:not([role])'
];

// Export all existing and new functions
module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    addLandmarkRegions,
    setSvgAttributes
};