const fs = require('fs');
const url = require('url');

// Dependency imports
const { dependencyGraphContent, indexContent } = require('./dependencyContent');
const utilities = require('./utilities');

const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav: originalHandleKeyboardNav,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasId: ensureElementIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  newFocusTrap,
  transformInputData
} = utilities;

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
  handleKeyboardNav: originalHandleKeyboardNav,
  newFocusTrap,
  exportUtils,
  personName: () => {},
  transformInputData
};

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = "element-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
  }
  return element;
};

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

// Add back any required exports that might have been removed.
function calculateSum(a, b) { return a + b; }

accessibilityUtils.initSkipLink = () => {
  const skipLink = document.querySelector('.skip-link');
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
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }

    if (e.key === 'Escape') {
      element.dispatchEvent(new KeyboardEvent('escape'));
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

// Credential response handling - uses the imported function from utilities

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(timestamp + " [" + level.toUpperCase() + "]: " + message);
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
    announceToScreenReader("Download of " + filename + " started");
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
  return filename.replace(/[^a-z0-9.-]/gi, '_');
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
  document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
    element.addEventListener('keydown', (e) => {
      const handlers = {
        Enter: () => element.click(),
        ' ': () => element.click()
      };
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

// Accessibility-related functions
function ensureDependencyGraphARIA() {
  const dependencyGraphElement = document.querySelector('.dependency-graph');
  if (dependencyGraphElement) {
    // Set appropriate ARIA role for the dependency graph container
    if (!dependencyGraphElement.getAttribute('role')) {
      dependencyGraphElement.setAttribute('role', 'region');
    }

    // Add accessible label if not already present
    if (!dependencyGraphElement.getAttribute('aria-label')) {
      dependencyGraphElement.setAttribute('aria-label', 'Dependency graph visualization');
    }
  }
}

const initiateAnnounceToScreenReader = (message, priority) => {
  announceToScreenReader(message, priority);
  announcementDelayHandler();
};

const announcementDelayHandler = () => {
  setTimeout(() => {
    const announcer = document.querySelector('#sr-announcer');
    if (announcer) {
      document.body.removeChild(announcer);
    }
  }, 1000);
};

const handleKeyboardNavKeyDownEvent = (e, handlers) => {
  if (e.key === 'Tab') {
    Object.values(handlers).forEach((handler) => {
      if (handler) {
        handler(e);
      }
    });
  }
};

// Stub implementations for exported functions that may be missing
function ensureElementAccessibility(element) {
  if (!element) return;
  if (!element.id) {
    ensureElementId(element);
  }
  if (!element.getAttribute('role') && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
    element.setAttribute('role', 'presentation');
  }
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  return announcer;
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function renderSimpleDependencyGraph(data) {
  return renderDependencyGraph(data);
}

function addAccessibleName(element, name) {
  if (element) {
    element.setAttribute('aria-label', name);
  }
  return element;
}

function addAccessibleNamesToSVGs(container) {
  if (!container) return;
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'Graph element ' + (index + 1));
    }
  });
}

const addSvgAccessibleNames = addAccessibleNamesToSVGs;

function fixFakeLinkIssue(links) {
  if (!Array.isArray(links)) return;
  links.forEach(link => {
    if (link && link.getAttribute('href') === '#' && !link.getAttribute('onclick')) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}

function addLangAttribute(element, lang) {
  if (element) {
    element.setAttribute('lang', lang);
  }
  return element;
}

function fixTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') return;
  
  // Ensure proper table structure
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }
  
  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      if (row.parentNode === table) {
        tbody.appendChild(row);
      }
    });
    table.appendChild(tbody);
  }
  
  return table;
}

function addMainLandmark(element) {
  if (element && !element.querySelector('main') && !document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('role', 'main');
    element.insertBefore(main, element.firstChild);
  }
  return element;
}

function fixLandmarkIssues(container) {
  if (!container) return;
  
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length > 1) {
    mainElements.forEach((el, index) => {
      if (index > 0) {
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', 'Content section ' + index);
      }
    });
  }
}

function initializeAccessibility() {
  initAccessibility();
  if (document.body) {
    const announcer = createAnnouncer();
    document.body.appendChild(announcer);
  }
}

function renderIndex(data) {
  return indexContent ? indexContent(data) : '';
}

function ensureHeadingHierarchy(container) {
  if (!container) return;
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      console.warn('Heading level skipped from h' + previousLevel + ' to h' + level);
    }
    previousLevel = level;
  });
}

function validateHeadingHierarchy(container) {
  if (!container) return { valid: true, issues: [] };
  const issues = [];
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      issues.push({
        type: 'heading',
        message: 'Heading level skipped at index ' + index,
        element: heading
      });
    }
    previousLevel = level;
  });
  return { valid: issues.length === 0, issues };
}

function renderAdditionalContent(data) {
  if (!data) return '';
  return '<div class="additional-content">' + (data.content || '') + '</div>';
}

function googleSignIn(response) {
  return handleCredentialResponse(response);
}

function decodeJwtResponse(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function ensureUniqueLandmarks(container) {
  if (!container) return;
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="footer"], [role="header"]');
  const counts = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    counts[role] = (counts[role] || 0) + 1;
    if (counts[role] > 1) {
      landmark.setAttribute('aria-label', role + ' ' + counts[role]);
    }
  });
}

const addSvgAccessibleName = addAccessibleName;

function calculateComplexity(nodes, edges) {
  return {
    nodeCount: nodes ? nodes.length : 0,
    edgeCount: edges ? edges.length : 0,
    complexityScore: (nodes ? nodes.length : 0) + (edges ? edges.length * 2 : 0)
  };
}

function checkLandmarkElement(element) {
  if (!element) return { isLandmark: false };
  const role = element.getAttribute('role');
  const isLandmark = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search', 'form'].includes(role);
  return { isLandmark, role };
}

function wrapPrimaryContentInMain(container) {
  if (!container) return container;
  const mainContent = container.querySelector('.primary-content, .main-content, #content');
  if (mainContent && !container.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    while (mainContent.firstChild) {
      main.appendChild(mainContent.firstChild);
    }
    mainContent.appendChild(main);
  }
  return container;
}

function checkLandmarks(container) {
  if (!container) return { hasMain: false, landmarks: [] };
  const landmarks = container.querySelectorAll('[role]');
  const landmarkList = Array.from(landmarks).map(el => ({
    role: el.getAttribute('role'),
    element: el
  }));
  return {
    hasMain: container.querySelector('main, [role="main"]') !== null,
    landmarks: landmarkList
  };
}

const a11yStore = {
  state: {},
  set: function(key, value) { this.state[key] = value; },
  get: function(key) { return this.state[key]; },
  clear: function() { this.state = {}; }
};

function anotherNewFunction() {
  return 'another function executed';
}

function handleAccessibilityIssues(issues) {
  if (!Array.isArray(issues)) return;
  issues.forEach(issue => {
    if (issue.element && issue.fix) {
      issue.fix(issue.element);
    }
  });
}

function renderDependencyGraphWithAccessibility(data) {
  const graph = renderDependencyGraph(data);
  if (graph.nodes && graph.nodes.length > 0) {
    ensureDependencyGraphARIA();
    addAccessibleNamesToSVGs(document.querySelector('.dependency-graph'));
  }
  return graph;
}

const initSkipLink = accessibilityUtils.initSkipLink;

const handleKeyboardNav = (e, handlers) => {
  originalHandleKeyboardNav(e, handlers);
  handleKeyboardNavKeyDownEvent(e, handlers);
};

function validateAndFixFormAccessibility(form) {
  if (!form || form.tagName !== 'FORM') return { valid: true, issues: [] };
  const issues = [];
  const labels = form.querySelectorAll('label');
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (!id) {
      ensureElementId(input);
      issues.push({ type: 'missing-id', element: input, fix: () => {} });
    }
    if (!labels.some(label => label.getAttribute('for') === id)) {
      issues.push({ type: 'missing-label', element: input });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

function validateAndFixLinkAccessibility(container) {
  if (!container) return { valid: true, issues: [] };
  const issues = [];
  const links = container.querySelectorAll('a');
  
  links.forEach(link => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      issues.push({ type: 'empty-link', element: link });
    }
    if (link.getAttribute('href') === '#' && !link.getAttribute('role')) {
      link.setAttribute('role', 'button');
      issues.push({ type: 'fake_link', element: link, fixed: true });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

function validateAndFixButtonAccessibility(container) {
  if (!container) return { valid: true, issues: [] };
  const issues = [];
  const buttons = container.querySelectorAll('button');
  
  buttons.forEach(button => {
    if (!button.textContent.trim() && !button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
      issues.push({ type: 'empty_button', element: button });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

module.exports = {
  ...utilities,
  ...accessibilityUtils,
  ensureElementId,
  ensureElementIdOrigin,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  newFocusTrap,
  handleCredentialResponse,
  initAccessibility,
  groupByCategory,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  exportUtilities,
  calculateSum,
  ensureDependencyGraphARIA,
  ensureElementAccessibility,
  createAnnouncer,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  addAccessibleName,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  fixLandmarkIssues,
  validateTableAccessibility,
  validateTableStructure,
  initializeAccessibility,
  renderIndex,
  ensureHeadingHierarchy,
  validateHeadingHierarchy,
  renderAdditionalContent,
  googleSignIn,
  decodeJwtResponse,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  calculateComplexity,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  a11yStore,
  anotherNewFunction,
  handleAccessibilityIssues,
  renderDependencyGraphWithAccessibility,
  initSkipLink,
  handleKeyboardNav,
  validateAndFixFormAccessibility,
  validateAndFixLinkAccessibility,
  validateAndFixButtonAccessibility,
  initiateAnnounceToScreenReader,
  handleTabNavigation: handleKeyboardNavKeyDownEvent
};