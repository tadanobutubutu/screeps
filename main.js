const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function validateLandmark(landmark) {
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
  return {
    success: issues.length === 0,
    issues
  };
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

const HTML = ({ lang }) => `<html lang="${lang}"></html>`;

function countDependencies() {
  // Count internal private functions (starting with '_')
  const internalDependencies = [];
  const globalObj = (typeof window !== 'undefined') ? window : global;
  const functions = [...Object.getOwnPropertyNames(globalObj)];
  functions.forEach((functionName) => {
    if (functionName.startsWith('_') && typeof globalObj[functionName] === 'function') {
      internalDependencies.push(functionName);
    }
  });
  const internalCount = internalDependencies.length;

  // Count npm dependencies from package.json (if in Node environment)
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

  // Return combined result
  if (error) {
    return {
      internalCount,
      external,
      error
    };
  } else {
    return {
      internalCount,
      external
    };
  }
}

function ensureUniqueLandmarks(landmarksArg) {
  const names = [];
  const duplicates = [];
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  // Ensure unique IDs
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

  // Check for duplicate accessible names
  if (Array.isArray(landmarks)) {
    landmarks.forEach(landmark => {
      const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
      if (names.includes(name)) {
        duplicates.push(name);
      } else {
        names.push(name);
      }
    });
  }

  // Check for duplicate roles (from origin/main)
  const landmarksByRole = {};
  const allLandmarks = document.querySelectorAll('[role]');
  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        duplicates.push(`Duplicate landmark role: ${role}`);
      } else {
        landmarksByRole[role] = true;
      }
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

function validateTableAccessibility(tableElement) {
  if (!tableElement.querySelector('caption')) {
      console.warn('Table missing caption');
      return false;
  }
  return true;
}

function validateTableStructure(tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) {
      console.warn('Table has no rows');
      return false;
  }
  return true;
}

function validateTableAccessibilityFull(table) {
  const issues = [];

  // Check for caption (from origin/main)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute (from HEAD)
  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells (from HEAD)
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

function validateTableStructureFull(tables) {
  const allIssues = [];
  
  // Handle both single table element and array of tables
  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    // Check for rows (from origin/main)
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }

    // Validate table accessibility (from HEAD)
    const result = validateTableAccessibilityFull(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
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

function getLangAttribute() {
    // Implementation to get language attribute
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    // Implementation to get full language attribute
    return document.documentElement.lang || navigator.language || 'en-US';
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
    // Implementation to create accessible in-page button (conflict resolved: merged implementation)
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues (optional)
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues = []) {
  const handled = [];
  const unhandled = [];

  // Process provided issues (from HEAD)
  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  // Perform DOM validation (from origin/main)
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach(landmark => {
    validateLandmark(landmark);
  });

  validateLandmarkStructure();
  ensureUniqueLandmarks();

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    getSvgAccessibleName(svg);
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

function createAccessibleLink(href, text) {
    // Implementation to create accessible link (conflict resolved: merged implementation)
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
      return 'Accessible SVG Icon';
  }
  const title = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');
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
}

// Export all existing and new functions
module.exports = {
    config,
    appState,
    appData,
    validateLandmark,
    countDependencies,
    ensureUniqueLandmarks,
    validateTableAccessibility,
    validateTableStructure,
    validateTableAccessibilityFull,
    validateTableStructureFull,
    validateLandmarkStructure,
    getLangAttribute,
    getFullLangAttribute,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    addLandmarkRegions,
    getSvgAccessibleName,
    setSvgAttributes
};