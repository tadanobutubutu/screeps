const fs = require('fs');
const url = require('url');

// Dependency imports
const { dependencyGraphContent, indexContent } = require('./dependencyContent');
const { main, ensureElementId: ensureElementIdOrigin, renderDependencyGraph } = require('./utilities');

// Destructure specific functions from main
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
  handleKeyboardNav,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  renderAdditionalContent,
  transformInputData,
  ensureElementHasId: ensureElementIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  newFocusTrap,
  transformInputData
} = main;

const accessibilityUtils = {
  ...main.accessibilityUtils,
  initSkipLink,
  trapFocus,
  newFocusTrap: originNewFocusTrap,
  announceToScreenReader: announceToScreenReaderWrapper,
  handleKeyboardNav: handleKeyboardNavWrapper
};

// Additional helper functions from HEAD branch
const calculateSum = (a, b) => a + b;

const sanitizeFilename = (filename) => filename.replace(/[^a-z0-9.-]/gi, '_');

const readFileSafe = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    return null;
  }
};

const processData = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
};

const filterValidItems = (items, validator) => {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
};

const groupByCategory = (items, getCategory) => {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
};

// Remaining functions from origin/main branch
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

function ensureDependencyGraphARIA() {
  const dependencyGraphElement = document.querySelector('.dependency-graph');
  if (dependencyGraphElement) {
    if (!dependencyGraphElement.getAttribute('role')) {
      dependencyGraphElement.setAttribute('role', 'region');
    }

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

function handleKeyboardNav(e, handlers) {
  handleKeyboardNav(e, handlers);
  handleKeyboardNavKeyDownEvent(e, handlers);
}

const handleKeyboardNavKeyDownEvent = (e, handlers) => {
  if (e.key === 'Tab') {
    Object.values(handlers).forEach((handler) => {
      if (handler) {
        handler(e);
      }
    });
  }
};

const newFocusTrap = originNewFocusTrap;

module.exports = {
  ...accessibilityUtils,
  renderDependencyGraph,
  renderIndex,
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName: main.addAccessibleName,
  ensureElementId,
  ensureElementIdOrigin,
  trapFocus,
  addAriaLabel,
  ensureDependencyGraphARIA,
  initiatedAnnounceToScreenReader,
  announcementDelayHandler,
  handleKeyboardNav,
  ...mainUtilities,
  renderAdditionalContent,
  transformInputData,
  calculateSum,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  ensureDependencyGraphARIA,
  initAccessibility,
  groupByCategory,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  ensureElementIdOrigin,
  renderIndex,
  validateTableAccessibility,
  validateTableStructure,
  addAccessibleName,
  ensureDependencyGraphARIA,
  initiateAnnounceToScreenReader,
  announcementDelayHandler,
  handleKeyboardNav,
  ...mainUtilities,
  renderAdditionalContent,
  transformInputData
};