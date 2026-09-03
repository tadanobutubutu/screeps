const main = require('./utilities');

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility,
  validateTableStructureForAccessibility,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  addLandmarkRegions,
  uniqueLandmarks,
  fixFakeLinkIssues,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  accessibilityUtils,
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
  ensureUniqueLandmarks,
  googleSignIn,
  decodeJwtResponse,
  fixLandmarkIssues,
  validateTableAccessibility,
  validateTableStructure,
  initializeAccessibility,
  renderIndex,
  newFunction,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  renderAdditionalContent,
  newFocusTrap
} = main;

const dependencyGraph = document.getElementById('dependencyGraph');

if (dependencyGraph) {
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region');
  }
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }
  if (!dependencyGraph.getAttribute('id')) {
    dependencyGraph.setAttribute('id', 'dependencyGraph');
  }
}

function addAccessibleName(svgString) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

const originalSvgString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const modifiedSvgString = addAccessibleName(originalSvgString);

function validateTableAccessibility(tableData) {
  return true;
}

function validateTableStructure(tableData) {
  return true;
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function personName(person) {
  return person && person.name || 'Unknown';
}

function validateLandmark(landmark) {
  return !!landmark;
}

function validateLandmarkStructure(landmark) {
  return !!landmark;
}

function getSvgAccessibleName(svg) {
  return svg && (svg.getAttribute('aria-label') || svg.getAttribute('title')) || '';
}

function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function validateTableStructure(container) {
  return validateTableStructureForAccessibility(container);
}

function validateHeadingHierarchy(headings) {
  return true;
}

function ensureHeadingHierarchy(container) {
  if (!container) return null;
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      const correctedLevel = previousLevel + 1;
      const newHeading = document.createElement(`h${correctedLevel}`);
      newHeading.innerHTML = heading.innerHTML;
      newHeading.className = heading.className;
      heading.parentNode.replaceChild(newHeading, heading);
      previousLevel = correctedLevel;
    } else {
      previousLevel = currentLevel;
    }
  });
  return container;
}

function renderAdditionalContent(additionalData) {
  return `<div>${JSON.stringify(additionalData)}</div>`;
}

function newFunction() {
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

function newFocusTrap(element, options = {}) {
  const {
    onDeactivate,
    allowOutsideClick = false,
    escapeDeactivates = true,
    clickDeactivates = true,
    returnFocus = true
  } = options;

  let previouslyFocusedElement = null;
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;

  const updateFocusableElements = () => {
    focusableElements = Array.from(element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.disabled && el.offsetParent !== null);
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
  };

  const handleKeydown = (e) => {
    if (e.key !== 'Tab') return;

    updateFocusableElements();

    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement?.focus();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement?.focus();
      }
    }
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape' && escapeDeactivates) {
      deactivate();
    }
  };

  const handleClick = (e) => {
    if (allowOutsideClick) return;
    if (!element.contains(e.target) && clickDeactivates) {
      deactivate();
    }
  };

  const activate = () => {
    previouslyFocusedElement = document.activeElement;
    updateFocusableElements();
    firstFocusableElement?.focus();
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClick);
  };

  const deactivate = () => {
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('keydown', handleEscape);
    document.removeEventListener('click', handleClick);
    if (returnFocus && previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
    onDeactivate?.();
  };

  return { activate, deactivate };
}

module.exports = {
  ...main,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility,
  validateTableStructureForAccessibility,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  addLandmarkRegions,
  uniqueLandmarks,
  fixFakeLinkIssues,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  accessibilityUtils,
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
  ensureUniqueLandmarks,
  googleSignIn,
  decodeJwtResponse,
  fixLandmarkIssues,
  validateTableAccessibility,
  validateTableStructure,
  initializeAccessibility,
  renderIndex,
  newFunction,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  renderAdditionalContent,
  newFocusTrap
};