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

  // Fix lang attribute on HTML element
  if (report.issues.missingLang) {
    const htmlElement = container.querySelector('html') || (container.ownerDocument && container.ownerDocument.querySelector ? container.ownerDocument.querySelector('html') : null) || (typeof document !== 'undefined' && document.querySelector ? document.querySelector('html') : null);
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }
  }

  // Add main landmark if missing
  if (report.issues.missingMainLandmark) {
    const mainElements = container.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
      const firstSection = container.querySelector('section');
      if (firstSection) {
        const doc = container.ownerDocument || (typeof document !== 'undefined' ? document : null);
        if (doc) {
          const mainElement = doc.createElement('main');
          while (firstSection.firstChild) {
            mainElement.appendChild(firstSection.firstChild);
          }
          firstSection.parentNode.insertBefore(mainElement, firstSection);
          firstSection.remove();
          fixes.mainLandmarkAdded = true;
        }
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
          if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            const previousSibling = element.previousElementSibling;
            const doc = container.ownerDocument || (typeof document !== 'undefined' ? document : null);
            if (previousSibling && previousSibling.textContent.trim() && doc) {
              const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const labelSpan = doc.createElement('span');
              labelSpan.id = labelId;
              labelSpan.textContent = previousSibling.textContent.trim();
              labelSpan.style.display = 'none';
              element.parentNode.insertBefore(labelSpan, element);
              element.setAttribute('aria-labelledby', labelId);
            } else {
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
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
          let titleElement = svg.querySelector('title');
          const doc = container.ownerDocument || (typeof document !== 'undefined' ? document : null);
          if (!titleElement && doc) {
            titleElement = doc.createElementNS('http://www.w3.org/2000/svg', 'title');
            const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            titleElement.id = titleId;
            titleElement.textContent = issue.suggestedName || 'Decorative SVG';
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
          const isNavigation = element.closest && element.closest('nav') !== null;
          if (isNavigation || element.tagName.toLowerCase() === 'a') {
            if (!element.hasAttribute('href')) {
              element.setAttribute('href', '#' + (element.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`));
              element.setAttribute('role', 'link');
              uniqueFakeLinksFixed.add(issue.selector);
              fixes.fakeLinksFixed++;
            }
          } else {
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

  return fixes;
}

module.exports = {
  ...main,

  implementAccessibilityFixesFromReport,

  addressAccessibilityIssues: (container) => {
    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0
    };

    // Add lang attribute to HTML element if missing
    const doc = container.ownerDocument || (typeof document !== 'undefined' ? document : null);
    const htmlEl = container.querySelector ? container.querySelector('html') : (doc && doc.querySelector ? doc.querySelector('html') : null);
    if (htmlEl && !htmlEl.hasAttribute('lang')) {
      htmlEl.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }

    // Add main landmark if missing
    const mainElement = container.querySelector ? container.querySelector('main') : null;
    if (!mainElement) {
      const body = container.querySelector ? container.querySelector('body') : (doc ? doc.body : null);
      if (body && doc) {
        const newMain = doc.createElement('main');
        while (body.firstChild) {
          newMain.appendChild(body.firstChild);
        }
        body.appendChild(newMain);
        fixes.mainLandmarkAdded = true;
      }
    }

    // Fix SVG accessible names
    if (container.querySelectorAll && typeof getSvgAccessibleName === 'function') {
      const svgElements = container.querySelectorAll('svg');
      svgElements.forEach(svg => {
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
          const accessibleName = getSvgAccessibleName(svg);
          if (accessibleName) {
            svg.setAttribute('aria-label', accessibleName);
            fixes.svgNamesAdded++;
          }
        }
      });
    }

    // Validate accessibility report
    if (typeof validateAccessibilityReport === 'function') {
      const report = validateAccessibilityReport(container);
      if (report && report.length > 0) {
        console.log(`Accessibility report contains ${report.length} remaining issues`, 'warn');
      }
    }

    // Fix fake link issues (elements that look like links but are missing href)
    if (container.querySelectorAll) {
      const linkIssues = container.querySelectorAll('a:not([href]), [role="link"]:not([href])');
      linkIssues.forEach(link => {
        if (!link.hasAttribute('href')) {
          link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`));
          fixes.fakeLinksFixed++;
        }
      });
    }

    // Log fixes
    if (fixes.langAdded) {
      console.log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
      console.log('Main landmark added', 'info');
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
      console.log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
      console.log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
      console.log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
    }

    return fixes;
  },

  focusTrap: focusTrap
};