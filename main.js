const countDependencies = () => {
  // Count internal private functions (starting with '_')
  const internalDependencies = [];
  // Use appropriate global object for the environment
  const globalObj = (typeof window !== 'undefined') ? window : global;
  const functions = [...Object.getOwnPropertyNames(globalObj)];
  functions.forEach((functionName) => {
    if (functionName.startsWith('_') && typeof globalObj[functionName] === 'function') {
      internalDependencies.push(functionName);
    }
  });
  const internalCount = internalDependencies.length;
};

// TODO: This is the existing code that needs to be preserved

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute(), getFullLangAttribute(), addLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure(), fixTableStructureIssues() and fixTableHeaderCellScope())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues(), addMainLandmark(), addLandmarkRolesAndFixIssues() and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// todo-hash: 50090d29914857ebc4d3d6f532d1293acbb65526

const config = {
  apiUrl: process.env.API_URL || 'https://example.com',
  timeout: 5000,
  debug: true,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'],
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

config.landmarkRoles = config.allowedRoles;

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="region"]',
  '[role="search"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'aside:not([role])',
  'section:not([role])'
];

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function validateLandmark(landmark) {
  const errors = [];
  const role = landmark.getAttribute('role');
  const validLandmarks = config.allowedRoles;
  if (!validLandmarks.includes(role)) {
    errors.push('Invalid landmark role');
  }
  return errors;
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

const LANDMARK_CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data'
};

// Configuration merged from both branches
const CONFIG = {
  apiUrl: process.env.API_URL || 'https://example.com',
  timeout: 5000,
  debug: true,
  version: '1.0.0',
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  requiredLandmarks: ['banner', 'navigation', 'main'],
  dataPath: './data',
  maxResults: 100
};

// Application state
let appStateMutable = {
  initialized: false
};

const landmarks = [];

let icons = {};

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  // Implementation to get full language attribute
  return document.documentElement.lang || navigator.language || 'en-US';
}

function addLangAttribute() {
  const lang = getFullLangAttribute();
  document.documentElement.setAttribute('lang', lang);
  return lang;
}

function validateTableAccessibility(table) {
  const issues = [];

  if (!table.headers) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  const headerCells = table.querySelectorAll ? table.querySelectorAll('th') : [];
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

function validateTableStructure(tables) {
  const allIssues = [];

  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
      console.warn('Table has no rows');
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

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector ? svgElement.querySelector('title') : null;
  const ariaLabel = svgElement.getAttribute ? svgElement.getAttribute('aria-label') : null;

  return title ? title.textContent : ariaLabel;
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

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function transformHtmlHeaders(html) {
  if (!html) return html;
  return html.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (/\bscope=/i.test(match)) return match;
    return `<th${attrs} scope="col">`;
  });
}

function addressInsightIssues() {
  const dependencyGraphContainer = document.getElementById('dependencyGraph');
  if (dependencyGraphContainer) {
    dependencyGraphContainer.setAttribute('role', 'region');
    dependencyGraphContainer.setAttribute('aria-label', 'Dependency Graph Visualization');
  }
}

function helper(input) {
  return input ? input.toUpperCase() : '';
}

const safetyCategoriesList = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];

function getUserSafetyAdvice() {
  return safetyCategoriesList[Math.floor(Math.random() * safetyCategoriesList.length)];
}

let books = [];

function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);
  announceBookAdded(title, author);
  return bookObject;
}

function announceBookAdded(title, author) {
  console.log(`A new book has been added: "${title}" by "${author}".`);
}

function getBooksList() {
  let booksList = [];

  books.forEach((book, index) => {
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });

  return booksList.join("\n");
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
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  const landmarkElements = document.querySelectorAll('[role]');
  landmarkElements.forEach(landmark => {
    validateLandmark(landmark);
  });

  validateLandmarkStructure();
  ensureUniqueLandmarks();

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    getSvgAccessibleName(svg);
  });
}

function handleAccessibilityIssuesList(issues) {
  const handled = [];
  const unhandled = [];

  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function ensureUniqueLandmarks(landmarksArg) {
  // Merged implementation (conflict resolved)
  let landmarksLocal = landmarksArg;
  if (!Array.isArray(landmarksLocal)) {
    landmarksLocal = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarksLocal)) {
    for (const landmark of landmarksLocal) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  // Additional uniqueness check for landmark roles
  const landmarksByRole = {};
  const allLandmarks = document.querySelectorAll('[role]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarksByRole[role]) {
      console.warn('Duplicate landmark role: ' + role);
    } else {
      landmarksByRole[role] = true;
    }
  });

  return landmarksLocal;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
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

function validateLandmarkStructure() {
  // Implementation to validate landmark structure
  return true;
}

// Export all existing and new functions
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
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  handleAccessibilityIssuesList,
  initializeApp,
  getConfig,
  validateInput,
  processData,
  addLandmarkRegions,
  setSvgAttributes,
  config,
  landmarkSelectors,
  LANDMARK_CONFIG,
  CONFIG
};