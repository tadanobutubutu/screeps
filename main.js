const main = require('./utilities');

const {
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap
} = main;

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

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

module.exports = {
  implementAccessibilityFixesFromReport,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap
};