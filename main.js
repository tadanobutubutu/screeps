import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from 'web-vitals';
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

// Dependency imports
import { dependencyGraphContent, indexContent } from './dependencyContent';

// Rename the main function in utilities to avoid the latest issue
import { main as renamedMain } from './utilities';

// Dependency imports from the renamed main function
const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateAccessibilityReport,
  announceToScreenReader: announceToScreenReaderOriginal,
  handleKeyboardNav: handleKeyboardNavOriginal,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementId: ensureElementIdOrigin,
  ensureElementHasId,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  transformInputData,
  initSkipLink,
  trapFocus
} = renamedMain;

// Create wrapper functions for compatibility
const announceToScreenReaderWrapper = announceToScreenReaderOriginal;
const handleKeyboardNavWrapper = handleKeyboardNavOriginal;

// Renamed the main function to match the name of the variable
const main = {};

// Add the following functions since they were expected in the exports
main.ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = "element-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
  }
  return element;
};

main.addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

main.renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

// Accessibility-related functions
function main.ensureDependencyGraphARIA() {
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

function main.initiateAnnounceToScreenReader(message, priority) {
  announceToScreenReaderWrapper(message, priority);
  main.announcementDelayHandler();
}

function main.announcementDelayHandler() {
  setTimeout(() => {
    document.body.removeChild(document.querySelector('#sr-announcer'));
  }, 1000);
}

function main.handleKeyboardNav(e, handlers) {
  handleKeyboardNavWrapper(e, handlers);
  main.handleKeyboardNavKeyDownEvent(e, handlers);
}

function main.handleKeyboardNavKeyDownEvent(e, handlers) {
  if (e.key === 'Tab') {
    Object.values(handlers).forEach((handler) => {
      if (handler) {
        handler(e);
      }
    });
  }
}

const getLangAttribute = () => {
  return navigator.language || navigator.userLanguage;
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  const lang = getLangAttribute();
  htmlElement.lang = lang;
}

function wrapPrimaryContentInMain() {
  const mainElement = document.querySelector('main');
  const primaryContent = document.querySelector('.primary-content');

  if (!mainElement) {
    const main = document.createElement('main');
    main.setAttribute('id', 'main');
    document.body.appendChild(main);
  }

  primaryContent.getAttribute('id') ? mainElement.appendChild(primaryContent) : mainElement.insertBefore(primaryContent, mainElement.firstChild);
}

function setSvgAttributes() {
  return a11y.setSvgAttributes();
}

function addFixLandmarkIssues() {
  return a11y.addFixLandmarkIssues();
}

function ensureUniqueLandmarks() {
  return a11y.ensureUniqueLandmarks();
}

function addMainLandmark() {
  return a11y.addMainLandmark();
}

function validateLandmarkAttributes() {
  return a11y.validateLandmarkAttributes();
}

function validateLandmarkOrigin() {
  return a11y.validateLandmarkOrigin();
}

function validateLinkAccessibility() {
  return a11y.validateLinkAccessibility();
}

function handleFakeLinks() {
  return a11y.handleFakeLinks();
}

function addProperLandmarkRegions() {
  return a11y.addProperLandmarkRegions();
}

function fixFakeLinkIssues() {
  return a11y.fixFakeLinkIssues();
}

function createAccessibleLink() {
  return a11y.createAccessibleLink();
}

function validateLandmarkContainer(container) {
  return a11y.validateLandmarkContainer(container);
}

function validateLandmarkStructureHelpers() {
  return a11y.validateLandmarkStructureHelpers();
}

function renderIndexView() {
  // Implementation to be added
}

function ensureLandmarkStruct() {
  const { validateLandmark, addFixLandmarkIssues, validateLandmarkOrigin } = a11y;
  validateLandmarkOrigin();

  const header = document.querySelector('header');
  if (header && !header.hasAttribute('aria-label')) {
      header.setAttribute('aria-label', 'Page header');
  }

  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.hasAttribute('aria-label')) {
      mainElement.setAttribute('aria-label', 'Main content');
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('aria-label')) {
      footer.setAttribute('aria-label', 'Page footer');
  }

  addFixLandmarkIssues();
}

function fixAccessibilityIssues() {
  // Implementation for fixAccessibilityIssues
}

function checkIfBodyContainButton() {
  // Implementation for checkIfBodyContainButton
}

function showModal() {
  // Implementation for showModal
}

function spawnButtons() {
  // Implementation for spawnButtons
}

function setAccessibleNamesForSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    svg.setAttribute('aria-label', accessibleName);
  });
}

function upgrade() {
  // Implementation for upgrade
}

function getCurrentLanguage() {
  // Implementation for getCurrentLanguage
}

function renderGraphIndex() {
  // Implementation for renderGraphIndex
}

export {
  // From imports
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateAccessibilityReport,
  announceToScreenReader: announceToScreenReaderOriginal,
  handleKeyboardNav: handleKeyboardNavOriginal,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementId: ensureElementIdOrigin,
  ensureElementHasId,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  transformInputData,
  initSkipLink,
  trapFocus,

  // From main object
  addAriaLabel,
  renderDependencyGraph,
  ensureDependencyGraphARIA,
  initiateAnnounceToScreenReader: main.initiateAnnounceToScreenReader,
  announcementDelayHandler: main.announcementDelayHandler,
  handleKeyboardNavKeyDownEvent: main.handleKeyboardNavKeyDownEvent,

  // Additional functions
  getLangAttribute,
  addLangAttribute,
  wrapPrimaryContentInMain,
  setSvgAttributes,
  addFixLandmarkIssues,
  ensureUniqueLandmarks,
  addMainLandmark,
  validateLandmarkAttributes,
  validateLandmarkOrigin,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  fixFakeLinkIssues,
  createAccessibleLink,
  validateLandmarkContainer,
  validateLandmarkStructureHelpers,
  renderIndexView,
  ensureLandmarkStruct,
  fixAccessibilityIssues,
  checkIfBodyContainButton,
  showModal,
  spawnButtons,
  setAccessibleNamesForSVGs,
  upgrade,
  getCurrentLanguage,
  renderGraphIndex
};

export * from './AnotherModule';