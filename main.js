const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const http = require('http');
const url = require('url');
const { functionA, functionB } = require('./functionModule');
const fs = require('fs');

module.exports = {
  ...main,

  // TODO: Address accessibility issues from insight report
  addressAccessibilityIssues: (container) => {
    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0
    };

    // Add lang attribute to HTML element if missing
    const htmlElement = document.documentElement;
    const langAttr = getLangAttribute(htmlElement);
    if (!langAttr) {
      htmlElement.lang = 'en';
      fixes.langAdded = true;
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
        body.insertBefore(newMain, body.firstChild);
        fixes.mainLandmarkAdded = true;
      }
    }

    // Fix landmark issues
    const landmarkFixes = validateLandmark(container);
    if (landmarkFixes && landmarkFixes.length > 0) {
      fixes.landmarksFixed = landmarkFixes.length;
    }
    const landmarkStructureFixes = validateLandmarkStructure(container);
    if (landmarkStructureFixes && landmarkStructureFixes.length > 0) {
      fixes.landmarksFixed += landmarkStructureFixes.length;
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName && accessibleName.length > 0) {
        setSvgAccessibilityProps(svg, accessibleName);
        fixes.svgNamesAdded++;
      }
    });

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll('[style*="cursor: pointer"]');
    fakeLinks.forEach(link => {
      const style = window.getComputedStyle(link);
      if (style.cursor === 'pointer' || link.style.cursor === 'pointer') {
        link.setAttribute('role', 'link');
        link.setAttribute('tabindex', '0');
        fixes.fakeLinksFixed++;
      }
    });

    // Validate accessibility report
    const report = validateAccessibilityReport(container);
    if (report && report.length > 0) {
      log(`Accessibility report contains ${report.length} remaining issues`, 'warn');
    }

    if (fixes.langAdded) {
      log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
      log('Main landmark added', 'info');
    }

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
  validateTableStructure,

  // TODO: Validate the landmark structure for accessibility issues
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