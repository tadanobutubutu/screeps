import './styles.css';
import { initializeApp, config, renderDependencyGraph, displayModuleStructure, newFunction, calculateSum, getLangAttribute, getFullLangAttribute, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, setSvgAttributes, validateLinkAccessibility, addProperLandmarkRegions, CONFIG, newFunction3, newFunction4, function3, processIssue, handleIssueChanges, getUniqueLandmarks, processLandmarks, countDependencies, validateTableAccessibilityLocal, validateTableStructureLocal, scanAccessibility, generateAccessibilityReport, validateLinkAccessibilityLocal as validateLinkAccessibility, handleFakeLinks, validateLandmarkLocal as validateLandmark, validateLandmarkStructureLocal as validateLandmarkStructure, addMissingLandmarkIds, fixFakeLinks, addAriaLabelledbyToLinksWithComplexSvg, getSvgAccessibleNameUtil as getSvgAccessibleName, setSvgAttributesUtil as setSvgAttributes, createAccessibleLink as createAccessibleLink, loadLandmarks, checkLandmarkElement, validateLandmarkData, ensureUniqueLandmarksFromString, createInPageButton, wrapPrimaryContentInMain, addLangAttribute } from './index';
export {
  initializeApp,
  config,
  renderDependencyGraph,
  displayModuleStructure,
  newFunction,
  calculateSum,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  addProperLandmarkRegions,
  CONFIG,
  newFunction3,
  newFunction4,
  function3,
  processIssue,
  handleIssueChanges,
  getUniqueLandmarks,
  processLandmarks,
  countDependencies,
  validateTableAccessibilityLocal,
  validateTableStructureLocal,
  scanAccessibility,
  generateAccessibilityReport,
  validateLinkAccessibility,
  handleFakeLinks,
  validateLandmark,
  validateLandmarkStructure,
  addMissingLandmarkIds,
  fixFakeLinks,
  addAriaLabelledbyToLinksWithComplexSvg,
  getSvgAccessibleNameUtil,
  setSvgAttributesUtil,
  createAccessibleLink,
  loadLandmarks,
  checkLandmarkElement,
  validateLandmarkData,
  ensureUniqueLandmarksFromString,
  createInPageButton,
  wrapPrimaryContentInMain,
  addLangAttribute
};

// Additions from the conflicting branch
function validateTableAccessibilityLocal(tableElement, isStrictMode = false) {
  if (!tableElement || !tableElement.tagName.toLowerCase() === 'table') return false;

  const rows = tableElement.querySelectorAll('tr');
  const headers = tableElement.querySelectorAll('th');

  if (isStrictMode) {
    for (const row of rows) {
      const tdElements = row.querySelectorAll('td');
      if (tdElements.length !== headers.length) {
        return false;
      }
    }
  }

  for (const cell of Array.from(headers).concat(...Array.from(rows).map(row => Array.from(row.querySelectorAll('td'))))) {
    if (!cell.id && cell.textContent.trim() === '') {
      return false;
    }
  }

  return true;
}

function validateTableStructureLocal(tableElement) {
  if (!tableElement || !tableElement.tagName.toLowerCase() === 'table') return false;

  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('th, td');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.id) {
          return false;
        }
        if (!cell.hasAttribute('scope')) {
          console.log('TH does not have scope attribute');
        }
        if (cell.getAttribute('scope') !== 'col') {
          console.log('Invalid scope attribute', cell.getAttribute('scope'));
        }
      }
    }
  }

  return hasHeader;
}

function countDependencies(dependencies) {
  return dependencies.length;
}

function validateLinkAccessibilityLocal(linkElement) {
  if (!linkElement || !linkElement.tagName.toLowerCase() === 'a') return false;

  const href = linkElement.getAttribute('href');
  const text = linkElement.textContent.trim();

  if (!href || href === '#' || href === '') {
    return false;
  }

  if (!text && !linkElement.getAttribute('aria-label')) {
    return false;
  }

  if (linkElement.getAttribute('href') === 'javascript:void(0)' && !linkElement.getAttribute('role')) {
    linkElement.setAttribute('role', 'button');
  }

  return true;
}

function handleAccessibilityIssues() {
  const issues = [];

  const links = document.querySelectorAll('a');
  for (const link of links) {
    if (!validateLinkAccessibilityLocal(link)) {
      issues.push(link);
    }
  }

  const tables = document.querySelectorAll('table');
  for (const table of tables) {
    if (!validateTableAccessibilityLocal(table)) {
      issues.push(table);
    }
  }

  const tableStructures = document.querySelectorAll('table');
  for (const table of tableStructures) {
    if (!validateTableStructureLocal(table)) {
      issues.push(table);
    }
  }

  return issues;
}

function ensureLandmarkUniqueness(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) return landmarks;

  const uniqueLandmarks = [...new Set(landmarks.map(l => l.id))];
  return uniqueLandmarks.map((id, index) => {
    return { ...landmarks.find(l => l.id === id), id: `landmark-${index}` };
  });
}

// Additions from both branches
function validateTableAccessibility(tableElement, isStrictMode = false) {
  if (!validateTableAccessibilityLocal(tableElement, isStrictMode)) {
    console.log('Table accessibility validation failed.');
  }

  // Call the existing validateTableAccessibility function
  validateTableAccessibility(tableElement);
}

function initialize() {
  if (!isInitialized) {
    isInitialized = true;
    appState.initialized = true;

    const appData = {
      title: 'Screeps',
      version: CONFIG.version
    };

    /**
     * Address accessibility issues from insight report:
     * - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute() and wrapPrimaryContentInMain())
     * - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
     * - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
     * - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
     * - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
     * - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
     */

    addLangAttribute();
    wrapPrimaryContentInMain();
    validateTableStructure();
    validateLinkAccessibility();
    fixFakeLinks();
    ensureUniqueLandmarks();
    addFixLandmarkIssues();
    addMissingLandmarkIds();
    validateTableAccessibility();

    // Load landmarks for accessibility processing
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);

    // Ensure the dependencyGraph container has a proper ARIA role
    ensureDependencyGraphAriaRole();

    // Process accessibility props for landmarks
    addressInsightIssues();
  }
}

/**
 * Browser-side Accessibility Utilities
 * These utilities provide DOM-based accessibility helpers for client-side use.
 * They are namespaced under `browserA11y` to avoid conflicts with Node/React utilities.
 */
const browserA11y = (() => {
  // ... Existing implementation from the conflicting branch

  // Addition from the conflicting branch
  function validateTableStructure(tableElement) {
    if (!tableElement || !tableElement.tagName.toLowerCase() === 'table') return false;

    const rows = tableElement.querySelectorAll('tr');
    let hasHeader = false;

    for (const row of rows) {
      const cells = row.querySelectorAll('th, td');
      for (const cell of cells) {
        if (cell.tagName.toLowerCase() === 'th') {
          hasHeader = true;
          if (!cell.id) {
            console.log('TH does not have an id');
          }
        }
      }
    }

    if (!hasHeader) {
      // Fall back to the existing implementation
      validateTableStructureLocal(tableElement);
    }
    return hasHeader;
  }

  // Addition from the HEAD branch
  function ensureUniqueLandmarksFromString(landmarks) {
    const landmarkStrings = landmarks.split(',').map(l => l.trim());
    const uniqueLandmarks = [...new Set(landmarkStrings.map(ensureUniqueLandmarkFromString))];
    return uniqueLandmarks.join(', ');
  }

  // Helper function for ensureUniqueLandmarksFromString, to be used in both browser and Node environments
  function ensureUniqueLandmarkFromString(landmark) {
    if (!landmark) return landmark;

    const id = landmark.id || landmark.name || `landmark-${Math.random()}`;
    const uniqueId = id.trim();

    if (!uniqueId) {
      throw new Error(`Invalid landmark id: ${id}`);
    }

    return uniqueId;
  }

  // ... existing implementation from the HEAD branch

  return {
    // ... existing implementation from the conflicting branch

    // Addition from the HEAD branch
    ensureUniqueLandmarksFromString,
    ensureUniqueLandmarkFromString
  };
})();

// Auto-initialize browser utilities if in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  browserA11y.init();
}

module.exports = {
  // ... existing export from the conflicting branch

  // Additions from both branches
  validateTableAccessibility,
  validateTableStructure,
  countDependencies,
  validateLinkAccessibility,
  handleAccessibilityIssues,
  validateTableAccessibilityLocal,
  ensureLandmarkUniqueness
};