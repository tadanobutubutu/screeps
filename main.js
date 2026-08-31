const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap, checkAccessibility } = main;

// REACT_015: Add lang attribute to HTML element (ensureDependencyGraphARIA, getLangAttribute)
function applyLangAttribute() {
  const getLangAttribute = () => document.documentElement ? document.documentElement.lang || 'en' : 'en';
  if (document.documentElement) {
    document.documentElement.lang = getLangAttribute();
  }
}
applyLangAttribute();

// Implement the function for addressing accessibility issues from insight report
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

  // Add lang attribute to HTML element if missing
  const htmlEl = container.querySelector('html') || (container.ownerDocument && container.ownerDocument.querySelector('html'));
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main');
  if (!mainElement) {
    const body = container.querySelector('body');
    if (body) {
      const newMain = container.ownerDocument.createElement('main');
      newMain.setAttribute('id', 'main-content');
      while (body.firstChild) {
        newMain.appendChild(body.firstChild);
      }
      body.appendChild(newMain);
      fixes.mainLandmarkAdded = true;
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container);
  fixButtonIdentifiers(container);
  fixDependencyGraphAria(container);
  addMainLandmarkToIndex(container);

  // Fix landmark issues
  validateLandmark(container);
  validateLandmarkStructure(container);

  // Ensure main landmark has an id
  const main = container.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }

  // Ensure navigation landmarks have accessible names and ids
  const navigations = container.querySelectorAll('nav');
  navigations.forEach((nav, index) => {
    if (!nav.id) {
      nav.id = `navigation-${index + 1}`;
    }
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `navigation-${index + 1}`);
    }
  });

  // Ensure region landmarks have ids
  const regions = container.querySelectorAll('[role="region"]');
  regions.forEach((region, index) => {
    if (!region.id) {
      region.id = `region-${index + 1}`;
    }
  });

  fixes.landmarksFixed = navigations.length + regions.length + (main ? 1 : 0);

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', accessibleName);
      fixes.svgNamesAdded++;
    }
  });

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`));
    link.setAttribute('role', 'link');
    fixes.fakeLinksFixed++;
  });

  // Validate accessibility report
  const accessibilityReport = validateAccessibilityReport(container);
  if (accessibilityReport && accessibilityReport.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.length} remaining issues`, 'warn');
  }

  // Implement focus trap for keyboard navigation
  focusTrap(container);

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info');
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info');
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container);
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`, 'error');
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
  }

  return fixes;
}

// Accessibility-related function to be added
function checkAccessibility(content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return [];
}

// Table accessibility fix function
function fixTableStructure(container) {
  let fixedCount = 0;
  const tables = container.querySelectorAll('table');

  tables.forEach(table => {
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (!existingTbody && rows.length > 0) {
      const remainingRows = rows.length > 1 ? Array.from(rows).slice(1) : [];
      if (remainingRows.length > 0) {
        const tbody = container.ownerDocument.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = container.ownerDocument.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        row.replaceChild(th, firstCell);
        fixedCount++;
      }
    });

    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.scope) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addressAccessibilityIssues, implementAccessibilityFixesFromReport, fixTableStructure, checkAccessibility };
}

if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.implementAccessibilityFixesFromReport = implementAccessibilityFixesFromReport;
  window.fixTableStructure = fixTableStructure;
  window.checkAccessibility = checkAccessibility;
}