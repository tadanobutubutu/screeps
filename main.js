const fs = require('fs');
const main = require('./utilities');

// Function to create in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

const {
    createInPageButton: mainCreateInPageButton,
    createWebResourceButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    announceToScreenReader,
    handleKeyboardNav,
    newFocusTrap,
    exportUtils,
    addressAccessibilityIssues,
    ensureElementHasId: ensureElementIdOrigin,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    renderAdditionalContent,
    transformInputData
} = main;

const accessibilityUtils = {
  initSkipLink: () => {},
  trapFocus: (element) => {},
  createInPageButton,
  createWebResourceButton: (options) => {},
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap,
  exportUtils,
  transformInputData
};

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = "element-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
  }
  return element;
};

const ensureElementIdOrigin = ensureElementId;

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

const renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

const renderDependencyGraphs = (dataArray) => {
  return dataArray.map(renderDependencyGraph);
};

const fixButtonIdentifiers = (container) => {
  if (!container) return;
  const buttons = container.querySelectorAll('button:not([id])');
  buttons.forEach((btn, index) => {
    btn.id = `btn-${index}-${Date.now()}`;
  });
};

const fixDependencyGraphAria = (container) => {
  if (!container) return;
  const graphs = container.querySelectorAll('[data-dependency-graph]');
  graphs.forEach(graph => {
    graph.setAttribute('role', 'img');
    graph.setAttribute('aria-label', graph.getAttribute('aria-label') || 'Dependency Graph');
  });
};

const addMainLandmarkToIndex = (container) => {
  if (!container) return;
  let main = container.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    main.id = 'main-content';
    while (container.firstChild) {
      main.appendChild(container.firstChild);
    }
    container.appendChild(main);
  }
  return main;
};

const focusTrap = (element) => {
  if (!element) return () => {};

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return () => {};

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstElement.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

const newFocusTrap = () => {
  return focusTrap;
};

// TODO: Implement the logic to handle the credential response
function handleCredentialResponse(response) {
    try {
        // Parse the credential response
        const parsedResponse = JSON.parse(response);

        // Validate the parsed response
        if (!parsedResponse || !parsedResponse.credentials) {
            throw new Error('Invalid response format');
        }

        // Store or use the credentials
        console.log('Credentials received:', parsedResponse.credentials);

        // Example: Store credentials in localStorage
        localStorage.setItem('credentials', JSON.stringify(parsedResponse.credentials));

    } catch (error) {
        console.error('Failed to handle credential response:', error);
    }
}

// Export functionality with accessibility support
const exportUtilities = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', "Download " + filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader("Download of " + filename + " started");
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtilities.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtilities.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log("Error reading file " + filePath + ": " + error.message, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();

  // Add keyboard support for all interactive elements
  document.querySelectorAll('[data-accessible]').forEach(element => {
    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      });
    });
  });
};

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(timestamp + " [" + level.toUpperCase() + "]: " + message);
}

accessibilityUtils.initSkipLink = () => {
  const skipLink = document.getElementById('skip-link');
  if (!skipLink) {
    const skipContainer = document.createElement('div');
    skipContainer.id = 'skip-link';
    skipContainer.className = 'sr-only';
    skipContainer.style.position = 'fixed';
    skipContainer.style.top = '0';
    skipContainer.style.left = '0';
    skipContainer.style.width = '100%';
    skipContainer.style.height = '100%';
    skipContainer.style.zIndex = '99999';

    const skipLinkElement = document.createElement('a');
    skipLinkElement.href = '#main-content';
    skipLinkElement.textContent = 'Skip to main content';
    skipLinkElement.ariaLabel = 'Skip to main content';
    skipContainer.appendChild(skipLinkElement);

    document.body.appendChild(skipContainer);
  }
};

accessibilityUtils.trapFocus = (element) => {
  if (!element) {
    return () => {};
  }

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    console.warn('No focusable elements found in container');
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }

    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('focusTrapEscape'));
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstElement.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
function fixTableStructure(tableElement) {
  if (!tableElement) return null
  
  const headers = tableElement.querySelectorAll('th')
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      const row = th.closest('tr')
      const cellIndex = Array.from(row.children).indexOf(th)
      th.setAttribute('scope', 'col')
    }
  })
  
  const captions = tableElement.querySelectorAll('caption')
  if (captions.length === 0) {
    const caption = document.createElement('caption')
    tableElement.insertBefore(caption, tableElement.firstChild)
  }
  
  return tableElement
}

/**
 * Additional accessibility helper function
 * Adds accessible name to SVG elements
 */
function addSvgAccessibleName(svgElement, name) {
  if (!svgElement) return null
  
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    if (name) {
      svgElement.setAttribute('aria-label', name)
    } else {
      const title = svgElement.querySelector('title')
      if (title && title.textContent) {
        svgElement.setAttribute('aria-label', title.textContent)
      }
    }
  }
  
  return svgElement
}

/**
 * Helper function to validate table structure for accessibility
 */
function validateTableStructureForAccessibility(tableData) {
  // Implementation placeholder
  return true
}

function addAccessibleName(element, name) {
  if (!element) return null
  element.setAttribute('aria-label', name)
  return element
}

function renderAdditionalContent(additionalData) {
  // Placeholder implementation
  return ''
}

function checkAccessibilityForReport(content) {
  // Placeholder implementation
  return []
}

function renderGraphIndex(content, options = {}) {
  return content
}

function preferReducedMotion() {
  // Placeholder implementation
  return false
}

function renderSimpleDependencyGraph(content) {
  // Placeholder implementation
  return content
}

function getActiveSessionsCount() {
  return appState.sessions.size
}

function validateSession() {
  return false
}

function accessibilityUtilsObj() {
  // Placeholder for accessibility utilities
  return {}
}

function createAnnouncer() {
  // Placeholder for announcer creation
  return { announce: function() {} }
}

function addAccessibleNamesToSVGs(container) {
  const svgElements = container.querySelectorAll('svg')
  svgElements.forEach((svg) => {
    addSvgAccessibleName(svg)
  })
  return container
}

function addSvgAccessibleNames(container) {
  const svgElements = container.querySelectorAll('svg')
  svgElements.forEach((svg) => {
    addSvgAccessibleName(svg)
  })
  return container
}

function fixFakeLinkIssue(element) {
  if (!element) return false
  if (!element.hasAttribute('href')) {
    element.setAttribute('href', '#' + (element.id || `link-${Date.now()}`))
    element.setAttribute('role', 'link')
  }
  return true
}

function fixFakeLinkIssues(container) {
  const fakeLinks = container.querySelectorAll('a:not([href])')
  fakeLinks.forEach(link => {
    fixFakeLinkIssue(link)
  })
  return container
}

function fixLandmarkIssues(container) {
  validateLandmark(container)
  validateLandmarkStructure(container)
  return container
}

function addMainLandmark(container) {
  const mainElement = container.querySelector('main')
  if (!mainElement) {
    const body = container.querySelector('body')
    if (body) {
      const newMain = document.createElement('main')
      while (body.firstChild) {
        newMain.appendChild(body.firstChild)
      }
      body.appendChild(newMain)
    }
  }
  return container
}

function addLangAttribute(element, lang = 'en') {
  let htmlElement = element || document.documentElement
  if (!htmlElement) {
    return null
  }
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang)
  }
  return htmlElement
}

function ensureUniqueLandmarks(container) {
  return container
}

function fixTableStructureIssues(container) {
  const tables = container.querySelectorAll('table')
  tables.forEach(table => {
    fixTableStructure(table)
  })
  return container
}

function implementAccessibilityFixesFromReport(container, report) {
  return {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  }
}

function validateHeadingHierarchy() {
  // Placeholder for heading hierarchy validation
  return []
}

function ensureHeadingHierarchy() {
  // Placeholder for heading hierarchy enforcement
  return true
}

function updateUI() {
  return true
}

function ScreepsBot() {
  return {}
}

function exportUtils() {
  return {}
}

function addressAccessibilityIssues(container, report) {
  return implementAccessibilityFixesFromReport(container, report)
}

function renderDependencyGraphAria(container) {
  if (!container) return null
  container.setAttribute('role', 'region')
  container.setAttribute('aria-label', 'Dependency Graph')
  return container
}

function addLandmarkRegions(container) {
  return container
}

function uniqueLandmarks(container) {
  return container
}

function fixImageAltTexts(container) {
  return container
}

function googleSignIn() {
  return Promise.resolve()
}

function renderIndex() {
  // Placeholder for render index logic
  return document.createElement('div')
}

function checkAccessibility(container) {
  const issues = []
  
  if (!container) return issues
  
  const html = container.querySelector('html')
  if (!html || !html.hasAttribute('lang')) {
    issues.push('missing-lang-attribute')
  }
  
  const mainLandmarks = container.querySelectorAll('main')
  if (mainLandmarks.length === 0) {
    issues.push('missing-main-landmark')
  }
  
  return issues
}

function initializeAccessibility() {
  // Placeholder for initialization logic
}

function newFunction() {
  // Placeholder for new function
  return true
}

// Placeholder for additional code
let appState = { sessions: new Map() }

module.exports = {
  ...main,
  ...accessibilityUtils,
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  getSvgAccessibleName,
  getLangAttribute,
  ensureElementId,
  ensureElementIdOrigin,
  addMainLandmark,
  addLangAttribute,
  fixTableStructureIssues,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  renderDependencyGraphAria,
  addMainLandmarkToIndex,
  newFocusTrap,
  updateUI,
  newFunction,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  focusTrap,
  renderAdditionalContent,
  handleCredentialResponse,
  initAccessibility,
  groupByCategory,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  exportUtilities,
  addSvgAccessibleName,
  addAccessibleName,
  renderDependencyGraph,
  fixTableStructure,
  fixTableStructureForAccessibility: validateTableStructureForAccessibility,
  checkAccessibility,
  initializeAccessibility,
  renderIndex,
  renderGraphIndex,
  preferReducedMotion,
  renderSimpleDependencyGraph,
  getActiveSessionsCount,
  validateSession,
  accessibilityUtils: accessibilityUtilsObj,
  createAnnouncer,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addMainLandmark,
  addLangAttribute,
  ensureUniqueLandmarks,
  fixTableStructureIssues,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  preferReducedMotion,
  renderSimpleDependencyGraph,
  addAccessibleName,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  updateUI,
  ScreepsBot,
  exportUtils,
  addressAccessibilityIssues,
  renderDependencyGraphAria,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn
};