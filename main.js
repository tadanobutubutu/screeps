const main = require('./utilities')

function createInPageButton(buttonId, buttonText, buttonClass) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  button.setAttribute('type', 'button');
  return button;
}

function function3(insightReport) {
  const results = {
    compliant: [],
    nonCompliant: [],
    warnings: [],
    summary: {
      total: 0,
      compliantCount: 0,
      nonCompliantCount: 0,
      warningCount: 0
    }
  };

  if (!insightReport || !insightReport.issues) {
    return results;
  }

  const issues = insightReport.issues;
  results.summary.total = issues.length;

  issues.forEach(issue => {
    if (issue.severity === 'error') {
      results.nonCompliant.push(issue);
      results.summary.nonCompliantCount++;
    } else if (issue.severity === 'warning') {
      results.warnings.push(issue);
      results.summary.warningCount++;
    } else if (issue.severity === 'info') {
      results.compliant.push(issue);
      results.summary.compliantCount++;
    }
  });

  // Log summary for debugging
  console.log('Accessibility Compliance Report:', results.summary);

  // Perform automated fixes for common issues
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    const langAttr = getFullLangAttribute();
    if (langAttr) {
      htmlElement.setAttribute('lang', langAttr);
      console.log('Fixed: Added lang attribute to HTML element');
    }
  }

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  const main = addMainLandmarkToIndex(document.documentElement);

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  return results;
}

function addressAccessibilityIssues(insightReport) {
  console.log('Addressing accessibility issues:', insightReport);

  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    const langAttr = getFullLangAttribute();
    if (langAttr) {
      htmlElement.setAttribute('lang', langAttr);
    }
  }

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  validateLandmark(document.documentElement);
  validateLandmarkStructure(document.documentElement);
  ensureUniqueLandmarks();

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      setSvgAttributes(svg, { 'aria-label': accessibleName });
    }
  });

  handleFakeLinks();

  return { success: true };
}

function updateFunction() {
  return main.updateFunction();
}

function accessibleFunction() {
  return main.accessibleFunction();
}

function newFunction1() {
  return main.newFunction1();
}

function newFunction2() {
  return main.newFunction2();
}

function newFunction() {
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function ensureDependencyGraphARIA() {
  const elements = [];
  elements.forEach(el => {
    el.setAttribute('role', 'graph');
    el.setAttribute('aria-label', 'Dependency graph visualization');
  });
}

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

  const htmlEl =
    container.querySelector('html') ||
    (container.ownerDocument && container.ownerDocument.querySelector('html'));
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  const mainElement = container.querySelector('main');
  if (!mainElement) {
    // Create a new main element
    const newMain = document.createElement('main');
    newMain.setAttribute('role', 'main');

    const body = container.ownerDocument ? container.ownerDocument.body : document.body;
    if (body) {
      // Move all direct children of body (excluding existing header and footer) into the main
      // element and append it to the body
      const nodesToMove = Array.from(body.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase();
          return !(tagName === 'main' && node.getAttribute('role') === 'main') &&
                 !(tagName === 'header' || tagName === 'footer' || tagName === 'nav' || tagName === 'aside');
        }
        return false;
      });

      nodesToMove.forEach(node => {
        newMain.appendChild(node);
      });

      body.appendChild(newMain);
      fixes.mainLandmarkAdded = true;
    }
  }

  renderGraphIndex(container);

  validateLandmark(container);
  validateLandmarkStructure(container);
  fixes.landmarksFixed++;

  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName && !svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', accessibleName);
      fixes.svgNamesAdded++;
    }
  });

  const fakeLinks = container.querySelectorAll('a:not([href]), [role="link"]:not([href])');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('href')) {
      link.setAttribute('href', link.id || `#link-${Date.now()}`);
    }
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'link');
    }
    fixes.fakeLinksFixed++;
  });

  const accessibilityReport = validateAccessibilityReport(container);
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    console.log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`);
  }

  if (fixes.langAdded) {
    console.log('Lang attribute added to HTML element');
  }

  if (fixes.mainLandmarkAdded) {
    console.log('Main landmark added');
  }

  const newAccessibilityIssues = checkAccessibilityForReport(container);
  if (newAccessibilityIssues.length > 0) {
    console.log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`);
  }

  return fixes;
}

function navigate(destination) {
  if (typeof destination === 'string') {
    window.location.href = destination;
  } else if (destination && typeof destination.click === 'function') {
    destination.click();
  }
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    if (e.key === 'Escape') {
      element.setAttribute('aria-hidden', 'true');
      element.removeEventListener('keydown', handleKeyDown);
    }
  }

  element.addEventListener('keydown', handleKeyDown);

  if (firstFocusable) {
    firstFocusable.focus();
  }
}

function renderDependencyGraphs(container) {
  // Implementation placeholder
}

function fixButtonIdentifiers(container) {
  // Implementation placeholder
}

function fixDependencyGraphAria(container) {
  // Implementation placeholder
}

function addMainLandmarkToIndex(container) {
  // Check if container has a main element
  const existingMain = container.querySelector('main');
  if (existingMain) {
    return existingMain;
  }

  // Create a new main element
  const newMain = document.createElement('main');
  newMain.setAttribute('role', 'main');

  // Move all direct children of body (excluding existing header and footer) into the main
  // element and append it to the body
  const nodesToMove = Array.from(container.ownerDocument.body.childNodes).filter(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      return !(tagName === 'header' || tagName === 'footer' || tagName === 'nav' || tagName === 'aside');
    }
    return false;
  });

  nodesToMove.forEach(node => {
    newMain.appendChild(node);
  });

  // Insert main element after non-main landmarks (header, nav) but before footer
  let inserted = false;
  Array.from(container.ownerDocument.body.childNodes).forEach(node => {
    if (!inserted && node.nodeType === Node.ELEMENT_NODE &&
        (node.tagName.toLowerCase() === 'footer' || node.tagName.toLowerCase() === 'main')) {
      container.ownerDocument.body.insertBefore(newMain, node);
      inserted = true;
    }
  });

  // If no footer or main found, insert before temp content
  if (!inserted) {
    // First append landmark elements that were moved to temp container
    while (container.ownerDocument.body.firstChild) {
      newMain.appendChild(container.ownerDocument.body.firstChild);
    }
    container.ownerDocument.body.appendChild(newMain);
  }
  return newMain;
}

// Export for use in other modules
module.exports = {
  ...main,
  navigate,
  validateTableStructure,
  validateTableAccessibility,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  addLangAttribute,
  fixTableStructure,
  addAriaLabel,
  addAccessibleName,
  createInPageButton,
  ensureLangAttribute,
  ensureLandmarks,
  ensureUniqueLandmarks,
  fixTableStructures,
  fixFakeLinks,
  initGoogleSignIn,
  fixButtonIds,
  ensureSvgAccessibleNames,
  ensureDependencyGraphAriaRole,
  validateSession,
  handleCredentialResponse
};