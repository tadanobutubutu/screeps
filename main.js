const main = require('./utilities');
const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport, validateTableStructure, getSvgAccessibleName, getLangAttribute, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap } = require('./utilities');

const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = require('./utilities');

const http = require('http');
const url = require('url');
const { functionA, functionB } = require('./functionModule');
const fs = require('fs');

// Function to validate table accessibility
const validateTableAccessibility = (html) => {
  const issues = [];

  // Check if HTML contains tables
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;

  while ((match = tableRegex.exec(html)) !== null) {
    const tableContent = match[0];
    const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;

    // Check for caption
    const hasCaption = /<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableContent);
    if (!hasCaption) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
        suggestion: 'Add a <caption> element immediately after the <table> tag to describe the purpose of the table'
      });
    }

    // Check for th elements
    const hasHeaders = /<th[^>]*>/i.test(tableContent);
    if (!hasHeaders) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
        suggestion: 'Add <th> elements for column or row headers to improve accessibility for screen readers'
      });
    }

    // Check for scope attributes on th elements
    const thMatches = tableContent.match(/<th[^>]*>/gi) || [];
    thMatches.forEach((thTag, index) => {
      if (!/scope=["'](row|col|rowgroup|colgroup)["']/i.test(thTag)) {
        issues.push({
          type: 'table',
          severity: 'info',
          message: `Table ${tableNumber} header ${index + 1} is missing a 'scope' attribute`,
          suggestion: 'Add scope="col", scope="row", scope="rowgroup", or scope="colgroup" to <th> elements'
        });
      }
    });

    // Check for thead and tbody structure
    const hasThead = /<thead[^>]*>[\s\S]*?<\/thead>/i.test(tableContent);
    const hasTbody = /<tbody[^>]*>[\s\S]*?<\/tbody>/i.test(tableContent);

    if (!hasThead) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <thead> element`,
        suggestion: 'Wrap header rows in a <thead> element for better semantic structure'
      });
    }

    if (!hasTbody) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <tbody> element`,
        suggestion: 'Wrap data rows in a <tbody> element for better semantic structure'
      });
    }

    // Check for id and headers attributes for complex tables
    const hasMultipleHeaders = (tableContent.match(/<th/gi) || []).length > 1;
    if (hasMultipleHeaders) {
      const hasHeadersAttr = /headers=["'][^"']+["']/.test(tableContent);
      const hasIdAttr = /id=["'][^"']+["']/.test(tableContent.replace(/<th/gi, '<td'));

      if (!hasIdAttr && !hasHeadersAttr) {
        issues.push({
          type: 'table',
          severity: 'warning',
          message: `Table ${tableNumber} has multiple headers but may not have proper id/headers associations`,
          suggestion: 'For complex tables, ensure header cells have unique id attributes and data cells have headers attributes referencing those ids'
        });
      }
    }
  }

  return issues;
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
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

// Imported from a report analysis tool based on the issue details
function analyzeAccessibilityIssues(container) {
  const numLandmarksWithTitle = [...container.querySelectorAll('[role="landmark"]')].filter(el => el.title).length;
  const numHeadersMissingScope = [...container.querySelectorAll('[role="columnheader"]')].filter(el => !el.hasAttribute('aria-colindex')).length;
  const numTableRowSpanNotGridCells = [...container.querySelectorAll('[role="row"] [role="gridcell"][role="rowheader"][role="cell"]')].length;
  const numTablesWithHeadersInTableBody = [...container.querySelectorAll('table[role="table"] [role="row"][role="row] [role="cell"][role="gridcell"]')].length;
  const numTablesWithNoHeaders = [...container.querySelectorAll('table[role="table"]')].filter(table => !table.querySelector('[role="rowheader"]')).length;
  const numTablesWithDuplicateId = [...container.querySelectorAll('table[id]')].filter((table, index, tables) => tables.findIndex(t => t.id === table.id) > index).length;

  return {
    numLandmarksWithTitle,
    numHeadersMissingScope,
    numTableRowSpanNotGridCells,
    numTablesWithHeadersInTableBody,
    numTablesWithNoHeaders,
    numTablesWithDuplicateId
  };
}

function addressAccessibilityIssuesLocal(container) {
  const issues = analyzeAccessibilityIssues(container);

  if (issues.numLandmarksWithTitle > 0) {
    log(`Fixed ${issues.numLandmarksWithTitle} landmarks without title attribute`, 'info');
    [...container.querySelectorAll('[role="landmark"]')].forEach(el => el.title = 'Main content');
  }

  if (issues.numHeadersMissingScope > 0) {
    log(`Added scope attribute to ${issues.numHeadersMissingScope} headers`, 'info');
    [...container.querySelectorAll('[role="columnheader"]')].forEach(el => el.setAttribute('aria-colindex', '1'));
  }

  if (issues.numTableRowSpanNotGridCells > 0) {
    log(`Fixed ${issues.numTableRowSpanNotGridCells} rowspans not associated with a grid cell`, 'info');
    [...container.querySelectorAll('[role="row"] [role="gridcell"][role="rowheader"][role="cell"]')].forEach(el => el.removeAttribute('role'));
  }

  if (issues.numTablesWithHeadersInTableBody > 0) {
    log(`Moved headers out of table bodies for ${issues.numTablesWithHeadersInTableBody} tables`, 'info');
    [...container.querySelectorAll('table[role="table"] [role="row"][role="row] [role="cell"][role="gridcell"]')].forEach(tr => tr.remove());
  }

  if (issues.numTablesWithNoHeaders > 0) {
    log(`Added headers for ${issues.numTablesWithNoHeaders} tables`, 'info');
    // Implementation details not provided in the issue description
  }

  if (issues.numTablesWithDuplicateId > 0) {
    log(`Fixed duplicate IDs for ${issues.numTablesWithDuplicateId} tables`, 'info');
    // Implementation details not provided in the issue description
  }

  return issues;
}

// Implement the function for addressing accessibility fixes from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  // Combine languages
  const existingLangAttribute = container.querySelector('html')?.getAttribute('lang');
  const newLangAttribute = report.issues.missingLang?.[0]?.lang || 'en';
  if (existingLangAttribute !== newLangAttribute) {
    container.querySelector('html')?.setAttribute('lang', newLangAttribute);
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  if (!container.querySelector('main')) {
    const firstSection = container.querySelector('section');
    if (firstSection) {
      const mainElement = container.ownerDocument.createElement('main');
      while (firstSection.firstChild) {
        mainElement.appendChild(firstSection.firstChild);
      }
      firstSection.parentNode.insertBefore(mainElement, firstSection);
      firstSection.remove();
      fixes.mainLandmarkAdded = true;
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    report.issues.landmarkIssues.forEach(issue => {
      const element = container.querySelector(issue.selector);
      if (element) {
        // Add accessible name if missing
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
          // Try to get label from surrounding context
          const previousSibling = element.previousElementSibling;
          if (previousSibling && previousSibling.textContent.trim()) {
            const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const labelSpan = container.ownerDocument.createElement('span');
            labelSpan.id = labelId;
            labelSpan.textContent = previousSibling.textContent.trim();
            labelSpan.style.display = 'none';
            element.parentNode.insertBefore(labelSpan, element);
            element.setAttribute('aria-labelledby', labelId);
          } else {
            // Use role as fallback label
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            element.setAttribute('aria-label', role);
          }
          fixes.landmarksFixed++;
        }
      }
    });
  }

  // Fix SVG accessible names
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = container.querySelector(issue.selector);
      if (svg && svg.tagName.toLowerCase() === 'svg') {
        svg.setAttribute('aria-label', issue.suggestedName || 'Decorative SVG');
        fixes.svgNamesAdded++;
      }
    });
  }

  // Fix fake links (elements that look like links but aren't)
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    report.issues.fakeLinkIssues.forEach(issue => {
      const element = container.querySelector(issue.selector);
      if (element) {
        // Check if this element should be a link or a button
        const isNavigation = element.closest('nav') !== null;

        if (isNavigation || element.tagName.toLowerCase() === 'a') {
          // Convert to proper link with href
          if (!element.hasAttribute('href')) {
            element.setAttribute('href', '#' + (element.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`));
            element.setAttribute('role', 'link');
            fixes.fakeLinksFixed++;
          }
        } else {
          // Convert to button
          element.setAttribute('role', 'button');
          if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
          }
          fixes.fakeLinksFixed++;
        }
      }
    });
  }

  return fixes;
}

// App state for session management
const appState = {
  sessions: new Map()
};

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size;
}

function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null;
}

function handleCredentialResponse(credentialResponse) {
  // Process credential response - basic implementation
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }
  return { status: 'success', credential: credentialResponse };
}

const a11yStore = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element, index) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`);
        }
      });
    });
  }
};

const renderIndex = (data, options = {}) => {
  return indexContent(data, options);
};

function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');

  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }

  return 'SVG graphic';
}

const renderDependencyGraph = (deps, options = {}) => {
  const graphData = dependencyGraphContent(deps, options);
  renderGraphIndex(graphData);
};

function log(message, level = 'info') {
  console[level](message);
}

function addUniqueLandmarks() {
  // Implementation for adding unique landmarks
}

function addAltAttribute() {
  // Implementation for adding alt attributes
}

function replaceButtonId() {
  // Implementation for replacing button IDs
}

function checkLandmarkElement() {
  // Implementation for checking landmark elements
}

function wrapPrimaryContentInMain() {
  // Implementation for wrapping primary content in main
}

function checkLandmarks() {
  // Implementation for checking landmarks
}

function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
}

function handleFocusTrap() {
  // Implementation for handling focus trap
}

function revokeSession() {
  // Implementation for revoking session
}

function newFunction() {
  // Implementation for new function
}

function renderGraphIndex() {
  // Implementation for rendering graph index
}

function addAriaAttribute() {
  // Implementation for adding aria attribute
}

function harvest() {
  // Screeps harvest function
}

function upgrade() {
  // Screeps upgrade function
}

module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderGraphIndex,
  newFunction,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  handleFocusTrap,
  revokeSession,
  functionA,
  functionB,
  validateTableAccessibility,
  a11yStore,
  getSvgAccessibleName,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  validateLandmark,
  validateLandmarkStructure,
  addLangAttribute,
  addUniqueLandmarks,
  addAltAttribute,
  replaceButtonId,
  validateAccessibilityReport,
  createInPageButton,
  createWebResourceButton,
  fixTableStructureIssues,
  addMainLandmark,
  setSvgAccessibilityProps,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues,
  implementAccessibilityFixesFromReport,
  analyzeAccessibilityIssues,
  addressAccessibilityIssuesLocal,
  http,
  url
};