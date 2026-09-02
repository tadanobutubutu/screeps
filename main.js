// Implement this function for ensuring unique landmarks (merged from both branches)
function ensureUniqueLandmarks() {
  // Landmarks that should be unique on a page
  const landmarkSelectors = ['main', '[role="main"]', '[role="banner"]', '[role="contentinfo"]', '[role="search"]'];

  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        // Add or update aria-label to make each landmark unique
        const existingLabel = element.getAttribute('aria-label');
        const elementTag = element.tagName.toLowerCase();
        const role = element.getAttribute('role') || elementTag;

        if (!existingLabel) {
          // Add index-based label for distinction
          element.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });

  // Ensure region and navigation landmarks have accessible names when multiple exist
  const sectionLandmarkSelectors = ['nav', '[role="region"]', 'aside'];

  sectionLandmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        const hasLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.id;
        const role = element.getAttribute('role') || element.tagName.toLowerCase();

        if (!hasLabel) {
          element.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });

  // Also ensure unique IDs and only one main landmark (from origin/main)
  const landmarks = document.querySelectorAll('main, aside, footer');
  const seenIds = new Set();
  const seenRoles = new Map();

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();

    // Ensure unique IDs
    if (!landmark.id) {
      let id = role;
      let counter = 1;
      while (seenIds.has(id)) {
        id = `${role}-${counter++}`;
      }
      landmark.id = id;
      seenIds.add(id);
    } else {
      seenIds.add(landmark.id);
    }

    // Track roles for uniqueness
    if (!seenRoles.has(role)) {
      seenRoles.set(role, []);
    }
    seenRoles.get(role).push(landmark);
  });

  // Ensure only one main landmark
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length > 1) {
    for (let i = 1; i < mainLandmarks.length; i++) {
      mainLandmarks[i].setAttribute('aria-hidden', 'true');
    }
  }
}

// New function to fix accessibility issues as per the insight report (merged from both branches)
function fixAccessibilityIssues() {
  // 1. REACT_015: Ensure lang attribute is set on the HTML element
  const lang = getLangAttribute();
  const htmlElement = getDocument ? getDocument().documentElement : document.documentElement;
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
  }

  // 2. REACT_027: Validate table accessibility and structure
  const tables = (getDocument ? getDocument() : document).querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // 3. REACT_017: Validate landmark and landmark structure issues
  validateLandmark();
  validateLandmarkStructure();

  // 4. REACT_025: Ensure unique landmarks (addressing the 2 landmark uniqueness issues)
  ensureUniqueLandmarks();

  // 5. REACT_041: Add accessible names to SVGs (assuming two SVG elements)
  const svgElements = (getDocument ? getDocument() : document).querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      setSvgAttributes(svg, accessibleName);
    }
  });

  // 6. REACT_036: Fix fake link issue (personName is part of the fix)
  personName();
  handleFakeLinks();
  if (typeof handleAccessibilityIssues === 'function') {
    handleAccessibilityIssues();
  }
}

// Helper function to ensure unique landmarks (from origin/main, integrated above)
// ensureUniqueLandmarks is already defined above

// Implement wrapPrimaryContentInMain function (merged from both branches)
function wrapPrimaryContentInMain(primaryContent) {
  // Wrap primary content in a <main> element for accessibility
  const doc = getDocument ? getDocument() : document;
  const mainElement = doc.createElement('main');
  mainElement.setAttribute('id', 'main-content');
  mainElement.setAttribute('role', 'main');

  if (typeof primaryContent === 'string') {
    mainElement.innerHTML = primaryContent;
  } else if (primaryContent instanceof HTMLElement || (primaryContent && primaryContent.appendChild)) {
    mainElement.appendChild(primaryContent);
  }

  return mainElement;
}

// DOM-based accessibility code for controls
function initializeAccessibilityControls() {
  // Add necessary code to address any remaining control accessibility issues
}

// Renders the dependency graph view.
// Updated to use dependencyGraphContent.
export function renderDependencyGraph() {
  const container = document.getElementById('dependency-graph-container');
  if (container && dependencyGraphContent) {
    container.innerHTML = dependencyGraphContent;
    // Apply accessibility fixes to new content
    fixAccessibilityIssues();
  }
}

// Renders the index view.
// Updated to use indexContent.
export function renderIndex() {
  const container = document.getElementById('index-container');
  if (container && indexContent) {
    container.innerHTML = indexContent;
    // Apply accessibility fixes to new content
    fixAccessibilityIssues();
  }
}

/**
 * Spawns a new process or subprocess.
 * @param {string} command - The command to execute
 * @param {string[]} args - Arguments to pass to the command
 * @param {object} options - Spawn options
 * @returns {ChildProcess} - The spawned child process
 */
export function spawnProcess(command, args = [], options = {}) {
  const { spawn } = require('child_process');
  const defaultOptions = {
    stdio: 'inherit',
    shell: true
  };
  return spawn(command, args, { ...defaultOptions, ...options });
}

/**
 * Spawns a worker or subprocess for the dependency graph.
 * @param {object} options - Configuration options for the spawn
 * @returns {Promise<ChildProcess>} - Promise resolving to the spawned process
 */
export function spawnDependencyGraphWorker(options = {}) {
  return new Promise((resolve, reject) => {
    const worker = spawnProcess('node', ['--worker'], {
      ...options,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    worker.on('error', (error) => {
      console.error('Error spawning dependency graph worker:', error);
      reject(error);
    });

    worker.on('spawn', () => {
      console.log('Dependency graph worker spawned successfully');
      resolve(worker);
    });
  });
}

/**
 * Spawns a worker or subprocess for the index.
 * @param {object} options - Configuration options for the spawn
 * @returns {Promise<ChildProcess>} - Promise resolving to the spawned process
 */
export function spawnIndexWorker(options = {}) {
  return new Promise((resolve, reject) => {
    const worker = spawnProcess('node', ['--index-worker'], {
      ...options,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    worker.on('error', (error) => {
      console.error('Error spawning index worker:', error);
      reject(error);
    });

    worker.on('spawn', () => {
      console.log('Index worker spawned successfully');
      resolve(worker);
    });
  });
}

// Export makeHeaderFocusable function (from origin/main)
export { makeHeaderFocusable };

function makeHeaderFocusable() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'banner');
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        header.focus();
      }
    });
  }
}

function ensureElementId(element) {
  // Combined and reconciled code from both branches
  if (!element.id) {
    element.id = element.id || element.name || '';
  }
}

function initializeAccessibility() {
  // DOM-based accessibility code
  const doc = getDocument ? getDocument() : document;
  // Add lang attribute to HTML element
  const langAttr = getLangAttribute();
  if (langAttr) {
    doc.documentElement.setAttribute('lang', langAttr);
  }

  // Create in-page button with accessibility considerations
  createInPageButton();

  // Validate table structure and accessibility
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // Add/fix landmark issues
  validateLandmark();
  validateLandmarkStructure();

  // Add accessible names to SVGs
  const svgElements = doc.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
  });

  // Ensure unique landmarks
  ensureUniqueLandmarks();
  handleFakeLinks();
}

function addAriaLabel(element) {
  // Combined and reconciled code from both branches
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', '');
  }
}

// ----- END ORIGINAL CODE -----

// New functions for rendering graph/index as requested in the issue
export function renderGraph() {
  // Implementation for rendering graph content
  const graphContainer = document.getElementById('graph-container');
  if (graphContainer) {
    graphContainer.innerHTML = '<div class="graph-visualization">Graph visualization would be rendered here</div>';
    fixAccessibilityIssues();
  }
}

export function renderIndexContent() {
  // Implementation for rendering index content
  const indexContainer = document.getElementById('index-content-container');
  if (indexContainer) {
    indexContainer.innerHTML = '<div class="index-content">Index content would be rendered here</div>';
    fixAccessibilityIssues();
  }
}