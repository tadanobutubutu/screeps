const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addSvgAccessibleNames,
  fixFakeLinks,
  getUniqueLandmarks,
  validateLandmarkAttributes,
  newFocusTrap,
  getAccessibleLinkProps
} = require('./utils');

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

function validateLandmark(landmark) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!landmark.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(landmark.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${landmark.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    return document.documentElement.lang || navigator.language || 'en-US';
}

function validateTableAccessibility(tableElement) {
    if (!tableElement) {
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

function validateLandmarkStructure(landmarks) {
  const issues = [];

  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    const allLandmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) {
      issues.push('Missing main landmark');
    }
    if (!hasNavigation) {
      issues.push('Missing navigation landmark');
    }
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];
  let elementsToCheck = landmarks;

  if (!Array.isArray(landmarks)) {
    elementsToCheck = document.querySelectorAll('[role]');
  }

  elementsToCheck.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  const elementsById = {};
  const landmarksByRole = {};
  const allLandmarks = Array.isArray(landmarks) ? landmarks : elementsToCheck;

  allLandmarks.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        landmark.id += '_duplicate';
        duplicates.push(landmark.id);
      } else {
        elementsById[landmark.id] = true;
      }
    }
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        console.warn('Duplicate landmark role: ' + role);
        duplicates.push(role);
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

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function getSvgAccessibleName(svgElement) {
    if (!svgElement) return 'Accessible SVG Icon';

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
  return svg;
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

function handleAccessibilityIssues(issues = []) {
    const handled = [];
    const unhandled = [];

    issues.forEach(issue => {
        if (issue.fixable) {
            handled.push(issue);
        } else {
            unhandled.push(issue);
        }
    });

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

function addLangAttribute(element) {
    if (!element) return;
    element.setAttribute('lang', getFullLangAttribute());
    return element;
}

function fixTableStructure(tables) {
    const allIssues = [];
    const tableArray = Array.isArray(tables) ? tables : [tables];

    tableArray.forEach((table, index) => {
        const rows = table?.querySelectorAll('tr') || [];
        if (rows.length === 0) {
            allIssues.push({
                tableIndex: index,
                issues: ['Table has no rows']
            });
        }

        const result = validateTableAccessibility(table);
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

function addMainLandmark() {
  console.log('Adding main landmark');
}

function upgradeSystem() {
  const env = process.env;
  const config = getConfig();

  // Harvest upgrade
  console.log('Upgrading system...');
  return true;
}

module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAttributes,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  initializeApp,
  getConfig,
  validateInput,
  processData,
  addLandmarkRegions,
  addMainLandmark,
  fixTableStructure,
  upgradeSystem,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addSvgAccessibleNames,
  fixFakeLinks,
  getUniqueLandmarks,
  validateLandmarkAttributes,
  newFocusTrap,
  getAccessibleLinkProps
};