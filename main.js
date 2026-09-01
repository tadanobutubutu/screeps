const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap } = main;

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0,
    tableStructureFixed: 0,
    tableAccessibilityFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  // Fix lang attribute on HTML element
  if (report.issues.missingLang) {
    const htmlElement = container.querySelector('html') || container.ownerDocument?.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }
  }

  // Add main landmark if missing
  if (report.issues.missingMainLandmark) {
    const mainElements = container.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
      // Try to convert the first section to main
      const firstSection = container.querySelector('section');
      if (firstSection) {
        // Create a new main element and move content into it
        const mainElement = container.ownerDocument.createElement('main');
        while (firstSection.firstChild) {
          mainElement.appendChild(firstSection.firstChild);
        }
        firstSection.parentNode.insertBefore(mainElement, firstSection);
        firstSection.remove();
        fixes.mainLandmarkAdded = true;
      }
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    const uniqueLandmarksFixed = new Set();

    report.issues.landmarkIssues.forEach(issue => {
      if (issue.selector && !uniqueLandmarksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Add accessible name if missing
          if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const role = element.getAttribute('role') || element.tagName.toLowerCase();

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
              const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace(/[^a-zA-Z]/g, ' ');
              element.setAttribute('aria-label', roleLabel);
            }
            uniqueLandmarksFixed.add(issue.selector);
            fixes.landmarksFixed++;
          }
        }
      }
    });
  }

  // Add accessible names to SVGs
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = container.querySelector(issue.selector);
      if (svg && svg.tagName.toLowerCase() === 'svg') {
        // Check if SVG already has an accessible name
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
          // Look for a title element within the SVG
          let titleElement = svg.querySelector('title');

          if (!titleElement) {
            // Create a title element
            titleElement = container.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'title');
            const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            titleElement.id = titleId;
            titleElement.textContent = issue.suggestedName || 'Decorative SVG';

            // Insert title as first child of SVG
            if (svg.firstChild) {
              svg.insertBefore(titleElement, svg.firstChild);
            } else {
              svg.appendChild(titleElement);
            }

            svg.setAttribute('aria-labelledby', titleId);
            fixes.svgNamesAdded++;
          }
        }
      }
    });
  }

  // Fix fake links (elements that look like links but aren't)
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    const uniqueFakeLinksFixed = new Set();

    report.issues.fakeLinkIssues.forEach(issue => {
      if (issue.selector && !uniqueFakeLinksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Check if this element should be a link or a button
          const isNavigation = element.closest('nav') !== null;

          if (isNavigation || element.tagName.toLowerCase() === 'a') {
            // Convert to proper link with href
            if (!element.hasAttribute('href')) {
              element.setAttribute('href', '#' + (element.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`));
              element.setAttribute('role', 'link');
              uniqueFakeLinksFixed.add(issue.selector);
              fixes.fakeLinksFixed++;
            }
          } else {
            // Convert to button
            element.setAttribute('role', 'button');
            if (!element.hasAttribute('tabindex')) {
              element.setAttribute('tabindex', '0');
            }
            uniqueFakeLinksFixed.add(issue.selector);
            fixes.fakeLinksFixed++;
          }
        }
      }
    });
  }

  // Fix table structure issues
  if (report.issues.tableStructureIssues && Array.isArray(report.issues.tableStructureIssues)) {
    report.issues.tableStructureIssues.forEach(issue => {
      const table = container.querySelector(issue.selector);
      if (table && table.tagName.toLowerCase() === 'table') {
        const fixed = validateTableStructure(table);
        if (fixed) {
          fixes.tableStructureFixed++;
        }
      }
    });
  }

  // Fix table accessibility issues
  if (report.issues.tableAccessibilityIssues && Array.isArray(report.issues.tableAccessibilityIssues)) {
    report.issues.tableAccessibilityIssues.forEach(issue => {
      const table = container.querySelector(issue.selector);
      if (table && table.tagName.toLowerCase() === 'table') {
        const fixed = validateTableAccessibility(table);
        if (fixed) {
          fixes.tableAccessibilityFixed++;
        }
      }
    });
  }

  return fixes;
}

module.exports = {
  ...main,

  addressAccessibilityIssues: (container, report) => {
    // If report is provided, use the detailed implementation
    if (report) {
      return implementAccessibilityFixesFromReport(container, report);
    }

    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0,
      tableStructureFixed: 0,
      tableAccessibilityFixed: 0
    };

    // Add lang attribute to HTML element if missing
    const htmlElement = container.querySelector('html') || container.ownerDocument?.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }

    // Add main landmark if missing
    const mainElement = container.querySelector('main');
    if (!mainElement) {
      const body = container.querySelector('body');
      if (body) {
        const newMain = document.createElement('main');
        while (body.firstChild) {
          newMain.appendChild(body.firstChild);
        }
        body.appendChild(newMain);
        fixes.mainLandmarkAdded = true;
      }
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', accessibleName);
        fixes.svgNamesAdded++;
      }
    });

    // Validate accessibility report
    const validationResult = validateAccessibilityReport(container);
    if (validationResult && validationResult.length > 0) {
      console.warn(`Accessibility report contains ${validationResult.length} remaining issues`);
    }

    if (fixes.langAdded) {
      console.info('Lang attribute added to HTML element');
    }

    if (fixes.mainLandmarkAdded) {
      console.info('Main landmark added');
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
      console.info(`Fixed ${landmarkFixesCount} unique landmarks`);
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
      console.info(`Fixed accessible names for ${svgFixes} SVGs`);
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
      console.info(`Fixed fake link issues for ${fakeLinkFixes} elements`);
    }

    const tableStructureFixes = fixes.tableStructureFixed || 0;
    if (tableStructureFixes > 0) {
      console.info(`Fixed table structure issues for ${tableStructureFixes} tables`);
    }

    const tableAccessibilityFixes = fixes.tableAccessibilityFixed || 0;
    if (tableAccessibilityFixes > 0) {
      console.info(`Fixed table accessibility issues for ${tableAccessibilityFixes} tables`);
    }

    return fixes;
  },

  implementAccessibilityFixesFromReport,

  focusTrap
};