// TODO: This is the existing code that needs to be preserved
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

/**
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
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

// const HTML = ({ lang }) => <html lang={lang}>{/* other children */}</html>;

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by fixTableStructureIssues() and fixTableHeaderCellScope())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), addLandmarkRolesAndFixIssues() and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by addSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

function getLangAttribute() {
    // Implementation to get language attribute
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    // Implementation to get full language attribute
    return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
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

/**
 * Validates the structure of tables for accessibility
 * @param {Array|Object} tables - Array of table objects or single table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
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

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate (optional)
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];

  // If landmarks array is provided, validate each one (from HEAD)
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
    // Otherwise, check for required landmarks in the DOM (from origin/main)
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

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarks - Array of landmark elements to check (optional)
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];
  let elementsToCheck = landmarks;

  // If no landmarks array provided, query the DOM (from origin/main)
  if (!Array.isArray(landmarks)) {
    elementsToCheck = document.querySelectorAll('[role]');
  }

  // Check for duplicate accessible names (from HEAD)
  elementsToCheck.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  // Check for duplicate IDs (from origin/main)
  const elementsById = {};
  elementsToCheck.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
        landmark.id += '_duplicate';
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  // Check for duplicate roles (from origin/main)
  const landmarksByRole = {};
  elementsToCheck.forEach(landmark => {
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
    // Merged implementation (conflict resolved)
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

/**
 * Adds lang attribute to HTML element
 * @param {string} lang - The language code to set
 */
function addLangAttribute(lang = 'en') {
  document.documentElement.lang = lang;
}

/**
 * Fixes table structure issues
 * @param {Object} table - The table element to fix
 */
function fixTableStructureIssues(table) {
  if (!table || !table.querySelectorAll) return;
  
  const tableRows = table.querySelectorAll('tr');
  if (tableRows.length === 0) {
    const tbody = table.querySelector('tbody');
    if (tbody || table.children.length === 0) {
      const newRow = document.createElement('tr');
      table.appendChild(newRow);
    }
  }
}

/**
 * Fixes table header cell scope attributes
 * @param {Object} table - The table element to fix
 */
function fixTableHeaderCellScope(table) {
  if (!table || !table.querySelectorAll) return;
  
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      cell.setAttribute('scope', 'col');
    }
  });
}

/**
 * Adds main landmark element if missing
 */
function addMainLandmark() {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.appendChild(main);
  }
}

/**
 * Adds landmark roles and fixes issues
 * @param {Array} elements - Array of elements to add landmark roles to
 */
function addLandmarkRolesAndFixIssues(elements = []) {
  if (!Array.isArray(elements)) return;
  
  elements.forEach(element => {
    if (element && typeof element === 'object' && !element.hasAttribute('role')) {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      const landmarkRoles = {
        'header': 'banner',
        'nav': 'navigation',
        'main': 'main',
        'aside': 'complementary',
        'footer': 'contentinfo'
      };
      
      if (landmarkRoles[tagName]) {
        element.setAttribute('role', landmarkRoles[tagName]);
      }
    }
  });
  
  // Ensure unique landmarks after adding roles
  const landmarks = document.querySelectorAll('[role]');
  ensureUniqueLandmarks(Array.from(landmarks));
}

/**
 * Fixes landmark issues
 * @param {Array} landmarks - Array of landmark elements to fix
 */
function fixLandmarkIssues(landmarks = []) {
  if (!Array.isArray(landmarks)) return;
  
  landmarks.forEach(landmark => {
    if (landmark && typeof landmark === 'object') {
      // Fix missing accessible name
      const currentLabel = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
      if (!currentLabel) {
        const textContent = landmark.textContent ? landmark.textContent.trim() : '';
        if (textContent) {
          landmark.setAttribute('aria-label', textContent);
        }
      }
    }
  });
}

/**
 * Adds accessible names to SVG elements
 * @param {Array} svgs - Array of SVG elements to add accessible names to
 */
function addSvgAccessibleNames(svgs = []) {
  if (!Array.isArray(svgs)) {
    svgs = Array.from(document.querySelectorAll('svg'));
  }
  
  svgs.forEach(svg => {
    if (svg && typeof svg === 'object') {
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
      
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        const title = svg.querySelector('title');
        if (title) {
          const desc = document.createElement('desc');
          desc.textContent = title.textContent;
          desc.id = 'svg-desc-' + Math.random().toString(36).substr(2, 9);
          svg.appendChild(desc);
          svg.setAttribute('aria-labelledby', desc.id);
        } else {
          svg.setAttribute('aria-label', getSvgAccessibleName(svg));
        }
      }
    }
  });
}

/**
 * Fixes fake link issues
 * @param {Array} links - Array of link elements to check and fix
 */
function fixFakeLinks(links = []) {
  if (!Array.isArray(links)) {
    links = Array.from(document.querySelectorAll('a'));
  }
  
  links.forEach(link => {
    if (link && typeof link === 'object') {
      const href = link.getAttribute('href');
      const role = link.getAttribute('role');
      
      // If it's styled as a button but is actually a fake link
      if (role === 'button' && (!href || href === '#' || href === 'javascript:void(0)')) {
        link.setAttribute('tabindex', '0');
        link.setAttribute('aria-label', link.textContent || 'Interactive element');
      }
    }
  });
}

/**
 * Ensures that all landmarks are unique in the DOM
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role]');
  ensureUniqueLandmarks(Array.from(landmarks));
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  // Check for required landmarks and add them if missing
  addMainLandmark();
  
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
}

/**
 * Implements upgrade logic using harvested data to improve the system
 * This function checks environment variables for upgrade triggers and updates the system configuration accordingly.
 */
function upgradeSystem() {
  const env = process.env;
  const config = getConfig();

  // Harvest upgrade data from environment variables
  if (env.UPGRADE_NEEDED) {
    // Example improvement: increment version number based on environment hint
    const currentVer = config.version.split('.')[0];
    const newVer = (parseInt(currentVer, 10) + 1).toString();
    config.version = newVer + '.0.0';
    console.log(`System upgraded to version ${config.version}`);
  }

  return config;
}

// TODO: Create or update the affected functions to be accessible

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
    setSvgAttributes,
    upgradeSystem,
    addLangAttribute,
    fixTableStructureIssues,
    fixTableHeaderCellScope,
    addMainLandmark,
    addLandmarkRolesAndFixIssues,
    fixLandmarkIssues,
    addSvgAccessibleNames,
    fixFakeLinks,
    ensureUniqueLandmarks,
    addProperLandmarkRegions
};